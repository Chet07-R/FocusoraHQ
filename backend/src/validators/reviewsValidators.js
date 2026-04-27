const { body } = require('express-validator');

const createReviewValidator = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('role')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Role must be between 2 and 60 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Review must be between 10 and 500 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be a whole number between 1 and 5'),
  body('photoURL')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Photo URL must be a valid URL'),
];

module.exports = {
  createReviewValidator,
};
