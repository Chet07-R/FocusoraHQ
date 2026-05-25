const { env } = require('../config/env');
const { ok, fail } = require('../utils/apiResponse');

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models';

const listModels = async (req, res) => {
  if (!env.geminiApiKey) {
    return fail(res, 503, 'GEMINI_DISABLED', 'Gemini API key is not configured');
  }

  if (typeof fetch !== 'function') {
    return fail(res, 500, 'FETCH_UNAVAILABLE', 'Server fetch API is unavailable. Use Node 18+ or add a fetch polyfill.');
  }

  const url = `${GEMINI_ENDPOINT}?key=${encodeURIComponent(env.geminiApiKey)}`;
  const response = await fetch(url, { method: 'GET' });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.error?.message || 'Gemini API request failed';
    return fail(res, response.status, 'GEMINI_ERROR', errorMessage, data?.error);
  }

  const models = Array.isArray(data?.models)
    ? data.models.map((model) => ({
        name: model.name,
        displayName: model.displayName,
        description: model.description,
        supportedGenerationMethods: model.supportedGenerationMethods,
      }))
    : [];

  return ok(res, { models });
};

const normalizeHistory = (history = []) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((item) => {
      const role = String(item?.role || '').toLowerCase();
      const content = String(item?.content || item?.text || '').trim();

      if (!content) {
        return null;
      }

      if (role === 'assistant' || role === 'model') {
        return { role: 'model', parts: [{ text: content }] };
      }

      return { role: 'user', parts: [{ text: content }] };
    })
    .filter(Boolean);
};

const extractReply = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts) || parts.length === 0) {
    return '';
  }

  return parts.map((part) => String(part?.text || '')).join('').trim();
};

const chatWithGemini = async (req, res) => {
  if (!env.geminiApiKey) {
    return fail(res, 503, 'GEMINI_DISABLED', 'Gemini API key is not configured');
  }

  if (typeof fetch !== 'function') {
    return fail(res, 500, 'FETCH_UNAVAILABLE', 'Server fetch API is unavailable. Use Node 18+ or add a fetch polyfill.');
  }

  const message = String(req.body?.message || '').trim();
  const history = normalizeHistory(req.body?.history);

  if (!message) {
    return fail(res, 400, 'MESSAGE_REQUIRED', 'Message is required');
  }

  const rawModel = env.geminiModel || 'gemini-2.5-flash';
  const model = rawModel.startsWith('models/') ? rawModel.slice('models/'.length) : rawModel;
  const url = `${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(
    env.geminiApiKey
  )}`;

  const payload = {
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.error?.message || 'Gemini API request failed';
    return fail(res, response.status, 'GEMINI_ERROR', errorMessage, data?.error);
  }

  const reply = extractReply(data);

  return ok(res, {
    model,
    reply,
  });
};

module.exports = {
  chatWithGemini,
  listModels,
};
