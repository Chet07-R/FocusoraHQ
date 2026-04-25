const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard, optionalAuth } = require('../middlewares/auth');
const { uploadBlogCover } = require('../middlewares/upload');
const { validate } = require('../middlewares/validate');
const { createBlogValidator } = require('../validators/blogsValidators');
const blogsController = require('../controllers/blogsController');

const router = express.Router();

router.get('/', asyncHandler(blogsController.listBlogs));
router.get('/mine', authGuard, asyncHandler(blogsController.listMyBlogs));
router.get('/:id', asyncHandler(blogsController.getBlogById));
router.post('/', optionalAuth, uploadBlogCover, createBlogValidator, validate, asyncHandler(blogsController.createBlog));
router.delete('/:id', authGuard, asyncHandler(blogsController.deleteBlog));

module.exports = router;
