const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard, optionalAuth } = require('../middlewares/auth');
const { uploadBlogCover } = require('../middlewares/upload');
const blogsController = require('../controllers/blogsController');

const router = express.Router();

router.get('/', asyncHandler(blogsController.listBlogs));
router.get('/:id', asyncHandler(blogsController.getBlogById));
router.post('/', optionalAuth, uploadBlogCover, asyncHandler(blogsController.createBlog));
router.delete('/:id', authGuard, asyncHandler(blogsController.deleteBlog));

module.exports = router;
