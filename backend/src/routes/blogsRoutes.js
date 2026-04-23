const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const blogsController = require('../controllers/blogsController');

const router = express.Router();

router.get('/', asyncHandler(blogsController.listBlogs));
router.get('/:id', asyncHandler(blogsController.getBlogById));
router.post('/', authGuard, asyncHandler(blogsController.createBlog));
router.delete('/:id', authGuard, asyncHandler(blogsController.deleteBlog));

module.exports = router;
