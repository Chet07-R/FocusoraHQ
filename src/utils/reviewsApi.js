import api from '../api';

const DEFAULT_REVIEW_AVATAR = '/images/Profile_Icon.png';

const resolvePhotoUrl = (photoURL) => {
  const value = String(photoURL || '').trim();

  if (!value) {
    return DEFAULT_REVIEW_AVATAR;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }

  if (!value.startsWith('/')) {
    return value;
  }

  const apiBaseUrl = String(api.defaults.baseURL || '').trim();

  if (!apiBaseUrl || apiBaseUrl.startsWith('/')) {
    return value;
  }

  try {
    return `${new URL(apiBaseUrl).origin}${value}`;
  } catch {
    return value;
  }
};

const normalizeReview = (review) => {
  if (!review) {
    return review;
  }

  const rating = Number.isFinite(Number(review.rating)) ? Number(review.rating) : 5;

  return {
    ...review,
    id: review.id || review._id,
    _id: review._id || review.id,
    name: review.name || 'Focusora User',
    role: review.role || 'Learner',
    message: review.message || '',
    rating: Math.max(1, Math.min(5, Math.round(rating))),
    photoURL: resolvePhotoUrl(review.photoURL),
  };
};

export const listReviews = async (limit = 30) => {
  const res = await api.get('/reviews', { params: { limit } });
  return Array.isArray(res.data) ? res.data.map(normalizeReview) : [];
};

export const createReview = async (payload) => {
  const body = {
    name: String(payload?.name || '').trim(),
    role: String(payload?.role || '').trim(),
    message: String(payload?.message || '').trim(),
    rating: Number(payload?.rating || 5),
  };

  const res = await api.post('/reviews', body);
  return normalizeReview(res.data);
};

export const defaultReviewAvatar = DEFAULT_REVIEW_AVATAR;
