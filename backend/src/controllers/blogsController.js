const fs = require('fs/promises');
const path = require('path');
const Blog = require('../models/Blog');
const { ok, fail } = require('../utils/apiResponse');

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80';

const normalizeReadTime = (content) => {
  const words = String(content || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
};

const resolveUploadedCoverImageUrl = (req) => {
  if (!req.uploadedCoverPath) {
    return '';
  }

  return req.uploadedCoverPath;
};

const isManagedUploadPath = (coverImageValue) => {
  return String(coverImageValue || '').startsWith('/uploads/blog-covers/');
};

const deleteManagedCoverImage = async (coverImageValue) => {
  if (!isManagedUploadPath(coverImageValue)) {
    return;
  }

  const relativeUploadPath = String(coverImageValue).replace(/^\//, '');
  const absoluteUploadPath = path.join(__dirname, '../../', relativeUploadPath);
  await fs.unlink(absoluteUploadPath).catch(() => {});
};

const toBlogPayload = (blog) => ({
  id: String(blog._id),
  _id: blog._id,
  authorId: blog.authorId ? String(blog.authorId) : '',
  authorName: blog.authorName,
  authorEmail: blog.authorEmail,
  title: blog.title,
  category: blog.category,
  excerpt: blog.excerpt,
  content: blog.content,
  coverImage: blog.coverImage || DEFAULT_COVER_IMAGE,
  readTime: blog.readTime,
  isCommunity: blog.isCommunity,
  status: blog.status,
  createdAt: blog.createdAt,
  updatedAt: blog.updatedAt,
});

const createBlog = async (req, res) => {
  const title = String(req.body.title || '').trim();
  const category = String(req.body.category || 'Focus').trim();
  const excerpt = String(req.body.excerpt || '').trim();
  const content = String(req.body.content || '').trim();
  const coverImage = String(req.body.coverImage || '').trim();
  const uploadedCoverImage = resolveUploadedCoverImageUrl(req);
  const authorNameFromBody = String(req.body.authorName || '').trim();
  const authorEmailFromBody = String(req.body.authorEmail || '').trim().toLowerCase();

  const authorName = req.user?.displayName || authorNameFromBody || 'FocusoraHQ Member';
  const authorEmail = req.user?.email || authorEmailFromBody;

  if (!title || !excerpt || !content) {
    await deleteManagedCoverImage(uploadedCoverImage);
    return fail(res, 400, 'BLOG_VALIDATION_ERROR', 'Title, excerpt, and content are required');
  }

  if (!req.user && !authorNameFromBody) {
    await deleteManagedCoverImage(uploadedCoverImage);
    return fail(res, 400, 'BLOG_VALIDATION_ERROR', 'Name is required for community blog publishing');
  }

  const blog = await Blog.create({
    ...(req.user?._id ? { authorId: req.user._id } : {}),
    authorName,
    authorEmail,
    title,
    category: category || 'Focus',
    excerpt,
    content,
    coverImage: uploadedCoverImage || coverImage || DEFAULT_COVER_IMAGE,
    readTime: normalizeReadTime(content),
    isCommunity: true,
    status: 'published',
  });

  return ok(res, toBlogPayload(blog), 201);
};

const listBlogs = async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit || 50), 100));
  const blogs = await Blog.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(limit);

  return ok(res, blogs.map(toBlogPayload));
};

const getBlogById = async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, status: 'published' });

  if (!blog) {
    return fail(res, 404, 'BLOG_NOT_FOUND', 'Blog not found');
  }

  return ok(res, toBlogPayload(blog));
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findOneAndDelete({
    _id: req.params.id,
    authorId: req.user._id,
  });

  if (!blog) {
    return fail(res, 404, 'BLOG_NOT_FOUND', 'Blog not found');
  }

  await deleteManagedCoverImage(blog.coverImage);

  return ok(res, { success: true });
};

module.exports = {
  createBlog,
  listBlogs,
  getBlogById,
  deleteBlog,
};
