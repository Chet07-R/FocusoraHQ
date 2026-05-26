const express = require('express');
const rateLimit = require('express-rate-limit');
const { asyncHandler } = require('../utils/asyncHandler');
const aiController = require('../controllers/aiController');
const { authGuard, optionalAuth } = require('../middlewares/auth');
const { env } = require('../config/env');
const { fail } = require('../utils/apiResponse');

const router = express.Router();

// Rate limits: signed-in users get the highest quota, guest accounts get a small trial quota, anonymous users get the smallest quota
const aiRateLimitAuth = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 120,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	handler: (req, res) => res.status(429).json({ code: 'RATE_LIMITED', message: 'Too many AI requests. Please try again later.' }),
});

const aiRateLimitGuest = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 20,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	handler: (req, res) => res.status(429).json({ code: 'RATE_LIMITED', message: 'Guest AI trial limit reached. Sign in for full access.' }),
});

const aiRateLimitAnon = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 6,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	handler: (req, res) => res.status(429).json({ code: 'RATE_LIMITED', message: 'Free AI trial limit reached. Sign in for full access.' }),
});

const conditionalAiRateLimit = (req, res, next) => {
	const mw = req.user?.provider === 'guest'
		? aiRateLimitGuest
		: req.user
			? aiRateLimitAuth
			: aiRateLimitAnon;
	return mw(req, res, next);
};

// Allow AI access when user is authenticated OR request originates from configured client URL(s)
const configuredOrigins = new Set(
	String(env.clientUrl || '')
		.split(',')
		.map((o) => o.trim())
		.filter(Boolean)
);

const ensureAiAccess = (req, res, next) => {
	if (req.user) return next();

	const origin = String(req.headers.origin || req.headers.referer || '');
	const isLocalDevOrigin = env.nodeEnv !== 'production' && /localhost|127\.0\.0\.1/.test(origin);

	if (configuredOrigins.has(origin) || isLocalDevOrigin) {
		return next();
	}

	return fail(res, 401, 'UNAUTHORIZED', 'AI access restricted to authenticated users or approved frontends');
};

router.post('/chat', optionalAuth, conditionalAiRateLimit, ensureAiAccess, asyncHandler(aiController.chatWithGemini));
router.get('/models', optionalAuth, conditionalAiRateLimit, ensureAiAccess, asyncHandler(aiController.listModels));

module.exports = router;
