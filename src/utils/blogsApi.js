import api from '../api';

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80';

const normalizeBlog = (blog) => {
  if (!blog) return blog;

  return {
    ...blog,
    id: blog.id || blog._id,
    _id: blog._id || blog.id,
    authorId: blog.authorId || '',
    authorName: blog.authorName || 'Focusora Member',
    authorEmail: blog.authorEmail || '',
    coverImage: blog.coverImage || DEFAULT_COVER_IMAGE,
    isCommunity: typeof blog.isCommunity === 'boolean' ? blog.isCommunity : true,
  };
};

export const listBlogs = async (limit = 50) => {
  const res = await api.get('/blogs', { params: { limit } });
  return Array.isArray(res.data) ? res.data.map(normalizeBlog) : [];
};

export const getBlogById = async (blogId) => {
  const res = await api.get(`/blogs/${blogId}`);
  return normalizeBlog(res.data);
};

export const createBlog = async (payload) => {
  const res = await api.post('/blogs', payload);
  return normalizeBlog(res.data);
};

export const deleteBlog = async (blogId) => {
  const res = await api.delete(`/blogs/${blogId}`);
  return res.data;
};

export const defaultBlogCoverImage = DEFAULT_COVER_IMAGE;
