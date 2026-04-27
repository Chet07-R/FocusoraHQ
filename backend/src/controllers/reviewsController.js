const Review = require('../models/Review');
const { ok, fail } = require('../utils/apiResponse');

const clampRating = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.max(1, Math.min(5, Math.round(parsed)));
};

const toReviewPayload = (review) => ({
  id: String(review._id),
  _id: review._id,
  authorId: review.authorId ? String(review.authorId) : '',
  name: review.name,
  role: review.role || 'Learner',
  message: review.message,
  rating: clampRating(review.rating),
  photoURL: review.photoURL || '',
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

const listReviews = async (req, res) => {
  const requestedLimit = Number(req.query.limit);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(Math.floor(requestedLimit), 100))
    : 30;

  const reviews = await Review.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(limit);

  return ok(res, reviews.map(toReviewPayload));
};

const createReview = async (req, res) => {
  const fallbackName = String(req.body.name || '').trim();
  const fallbackRole = String(req.body.role || '').trim();
  const fallbackMessage = String(req.body.message || '').trim();
  const fallbackPhotoURL = String(req.body.photoURL || '').trim();

  const name = String(req.user?.displayName || fallbackName).trim();
  const role = (fallbackRole || 'Learner').slice(0, 60);
  const message = fallbackMessage;
  const rating = clampRating(req.body.rating);
  const photoURL = String(req.user?.photoURL || fallbackPhotoURL).trim();

  if (!name) {
    return fail(res, 400, 'REVIEW_VALIDATION_ERROR', 'Name is required to submit a review');
  }

  if (!message) {
    return fail(res, 400, 'REVIEW_VALIDATION_ERROR', 'Review message is required');
  }

  const review = await Review.create({
    ...(req.user?._id ? { authorId: req.user._id } : {}),
    name,
    role,
    message,
    rating,
    photoURL,
    status: 'published',
  });

  return ok(res, toReviewPayload(review), 201);
};

module.exports = {
  listReviews,
  createReview,
};
