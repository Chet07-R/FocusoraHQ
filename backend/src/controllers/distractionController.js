const { ok, fail } = require('../utils/apiResponse');

const KEYWORDS = [
  'tiktok',
  'instagram',
  'youtube',
  'netflix',
  'scroll',
  'scrolling',
  'game',
  'gaming',
  'discord',
  'snapchat',
  'reddit',
  'twitter',
  'x.com',
  'shopping',
  'news',
  'chat',
];

const signalTipMap = {
  face_missing: 'I cannot see you. Sit back in view, reset your posture, and take one deep breath.',
  look_away: 'Eyes back on the task. Choose the next tiny step and start now.',
  idle: 'Stay with your task for the next 5 minutes. You are doing great.',
};

const buildPrompt = (text) => {
  const safeText = String(text || '').trim();
  return [
    'You are Focusora, a calm productivity coach.',
    'Does this text indicate distraction? Reply with JSON only: ',
    '{"distracted": boolean, "reason": string, "tip": string}.',
    `Text: "${safeText}"`,
  ].join(' ');
};

const classifyText = (text) => {
  const normalized = String(text || '').toLowerCase();
  const hit = KEYWORDS.find((keyword) => normalized.includes(keyword));
  if (hit) {
    return {
      distracted: true,
      reason: `Detected distraction keyword: ${hit}`,
      tip: 'Close the distraction and return to your next action. Start a 5-minute focus sprint.',
    };
  }

  return {
    distracted: false,
    reason: 'No distraction cues detected.',
    tip: 'You are good. Keep the momentum going for the next few minutes.',
  };
};

const coachDistraction = async (req, res) => {
  const text = String(req.body?.text || '').trim();
  const signal = String(req.body?.signal || '').trim();

  if (!text && !signal) {
    return fail(res, 400, 'DISTRACTION_VALIDATION_ERROR', 'Provide text or signal for coaching.');
  }

  const prompt = text ? buildPrompt(text) : '';
  const textResult = text ? classifyText(text) : null;
  const signalTip = signal ? (signalTipMap[signal] || signalTipMap.idle) : null;

  const distracted = textResult ? textResult.distracted : Boolean(signal && signal !== 'focused');
  const reason = textResult?.reason || (signal ? `Signal detected: ${signal}` : 'No signal provided');
  const tip = textResult?.tip || signalTip || signalTipMap.idle;

  return ok(res, {
    distracted,
    reason,
    tip,
    prompt,
    signal,
  });
};

module.exports = { coachDistraction };
