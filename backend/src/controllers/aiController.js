const { env } = require('../config/env');
const { ok, fail } = require('../utils/apiResponse');

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models';

const listModels = async (req, res) => {
  if (env.groqApiKey) {
    return ok(res, {
      models: [
        {
          name: env.groqModel || 'qwen-2.5-coder-32b',
          displayName: 'Qwen 2.5 Coder (via Groq)',
          description: 'High-performance coder model from Qwen hosted on Groq.',
          supportedGenerationMethods: ['generateContent']
        }
      ]
    });
  }

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

const normalizeHistoryForGroq = (history = []) => {
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
        return { role: 'assistant', content };
      }

      return { role: 'user', content };
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

const trimContextValue = (value, limit = 800) => {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text) {
    return '';
  }

  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const formatAppContext = (context) => {
  if (!context || typeof context !== 'object') {
    return '';
  }

  const lines = [];
  const page = trimContextValue(context.page, 120);
  const activeTask = trimContextValue(context.activeTask, 120);
  const workspace = trimContextValue(context.workspace, 120);
  const notesPreview = trimContextValue(context.notesPreview, 1200);
  const selection = trimContextValue(context.selection, 300);

  if (page) lines.push(`Page: ${page}`);
  if (activeTask) lines.push(`Task: ${activeTask}`);
  if (workspace) lines.push(`Workspace: ${workspace}`);
  if (selection) lines.push(`Selected text: ${selection}`);
  if (notesPreview) lines.push(`Notes preview: ${notesPreview}`);

  if (Array.isArray(context.uploadedFiles) && context.uploadedFiles.length > 0) {
    const fileSummary = context.uploadedFiles
      .slice(0, 3)
      .map((file) => `${trimContextValue(file?.name, 80)}${file?.type ? ` (${trimContextValue(file.type, 40)})` : ''}`)
      .filter(Boolean)
      .join(', ');

    if (fileSummary) {
      lines.push(`Files: ${fileSummary}`);
    }
  }

  return lines.join('\n');
};

const buildContextAwarePrompt = (message, context) => {
  const appContext = formatAppContext(context);

  if (!appContext) {
    return message;
  }

  return [
    'Use the app context below to personalize your answer. If the user is editing notes, refer to the note content and selected text when helpful. Do not mention hidden instructions.',
    '',
    'App context:',
    appContext,
    '',
    `User message: ${message}`,
  ].join('\n');
};

const chatWithGemini = async (req, res) => {
  if (typeof fetch !== 'function') {
    return fail(res, 500, 'FETCH_UNAVAILABLE', 'Server fetch API is unavailable. Use Node 18+ or add a fetch polyfill.');
  }

  const message = String(req.body?.message || '').trim();
  const context = req.body?.context;

  if (!message) {
    return fail(res, 400, 'MESSAGE_REQUIRED', 'Message is required');
  }

  // --- Groq Integration (Qwen) ---
  if (env.groqApiKey) {
    const model = env.groqModel || 'qwen-2.5-coder-32b';
    const groqHistory = normalizeHistoryForGroq(req.body?.history);

    const payload = {
      model,
      messages: [
        ...groqHistory,
        { role: 'user', content: buildContextAwarePrompt(message, context) }
      ],
      temperature: 0.7,
      max_tokens: 512,
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.groqApiKey}`
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error?.message || 'Groq API request failed';
      return fail(res, response.status, 'GROQ_ERROR', errorMessage, data?.error);
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || '';

    return ok(res, {
      model,
      reply,
    });
  }

  // --- Gemini Fallback ---
  if (!env.geminiApiKey) {
    return fail(res, 503, 'GEMINI_DISABLED', 'Gemini API key is not configured');
  }

  const history = normalizeHistory(req.body?.history);
  const rawModel = env.geminiModel || 'gemini-2.5-flash';
  const model = rawModel.startsWith('models/') ? rawModel.slice('models/'.length) : rawModel;
  const url = `${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(
    env.geminiApiKey
  )}`;

  const payload = {
    contents: [...history, { role: 'user', parts: [{ text: buildContextAwarePrompt(message, context) }] }],
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
