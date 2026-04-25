const { body } = require('express-validator');

const createBlogValidator = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 140 })
    .withMessage('Title must be between 3 and 140 characters'),
  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be 50 characters or fewer'),
  body('excerpt')
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('Excerpt must be between 20 and 500 characters'),
  body('content')
    .trim()
    .isLength({ min: 50, max: 20000 })
    .withMessage('Content must be between 50 and 20000 characters'),
  body('coverImage')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Cover image must be a valid URL'),
  body('authorName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Author name must be between 2 and 80 characters'),
  body('authorEmail')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Author email must be a valid email')
    .normalizeEmail(),
];

module.exports = {
  createBlogValidator,
};