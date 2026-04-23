const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    authorName: { type: String, required: true, trim: true },
    authorEmail: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Focus', trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    coverImage: { type: String, default: '', trim: true },
    readTime: { type: String, default: '1 min read', trim: true },
    isCommunity: { type: Boolean, default: true },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
