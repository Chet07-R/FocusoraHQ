const QUEST_ROTATION = ['sessions', 'minutes', 'streak', 'points'];

const MAX_REWARDS = 12;
const MAX_HISTORY = 12;

const DEFAULT_STATE = () => ({
  active: null,
  completedCount: 0,
  rewards: [],
  history: [],
  lastCompletedAt: null,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toSafeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
};

const getMetrics = (user) => ({
  points: toSafeNumber(user?.points),
  sessions: toSafeNumber(user?.sessionsCount),
  minutes: toSafeNumber(user?.totalStudyMinutes),
  streak: toSafeNumber(user?.focusStreak),
});

const formatDeltaText = (metric, target, current) => {
  const remaining = Math.max(0, target - current);

  if (metric === 'minutes') {
    return `${remaining} more minute${remaining === 1 ? '' : 's'}`;
  }

  if (metric === 'streak') {
    return `${remaining} more day${remaining === 1 ? '' : 's'}`;
  }

  return `${remaining} more ${metric === 'points' ? 'point' : 'session'}${remaining === 1 ? '' : 's'}`;
};

const getRewardPack = (metric, completedCount) => {
  const packs = {
    sessions: [
      { kind: 'badge', icon: '🏅', label: 'Focus Sprinter Badge', description: 'A profile badge for steady session builders.', pointsBonus: 25 },
      { kind: 'title', icon: '✨', label: 'Momentum Title', description: 'A display title for quick progress.', pointsBonus: 20 },
    ],
    minutes: [
      { kind: 'cosmetic', icon: '🎨', label: 'Aurora Theme Token', description: 'A cosmetic token for your study setup.', pointsBonus: 35 },
      { kind: 'frame', icon: '🖼️', label: 'Focus Frame Unlock', description: 'A profile frame reward.', pointsBonus: 30 },
    ],
    streak: [
      { kind: 'shield', icon: '🛡️', label: 'Streak Shield', description: 'A digital shield that protects your flow.', pointsBonus: 40 },
      { kind: 'badge', icon: '🔥', label: 'Streak Emblem', description: 'A streak-focused badge reward.', pointsBonus: 30 },
    ],
    points: [
      { kind: 'boost', icon: '⚡', label: 'XP Booster', description: 'A bonus-point reward pack.', pointsBonus: 50 },
      { kind: 'token', icon: '💎', label: 'Reward Token', description: 'A collectible reward token.', pointsBonus: 45 },
    ],
  };

  const pool = packs[metric] || packs.points;
  return pool[completedCount % pool.length];
};

const buildQuestTarget = (metric, metrics, completedCount) => {
  const step = completedCount + 1;

  if (metric === 'sessions') {
    return metrics.sessions + clamp(2 + step, 3, 12);
  }

  if (metric === 'minutes') {
    return metrics.minutes + clamp(45 + (step * 10), 45, 240);
  }

  if (metric === 'streak') {
    return metrics.streak + clamp(1 + Math.floor(step / 3), 1, 7);
  }

  return metrics.points + clamp(20 + (step * 8), 20, 150);
};

const buildQuestTitle = (metric, target) => {
  const metricLabels = {
    sessions: 'focus sessions',
    minutes: 'focus minutes',
    streak: 'day streak',
    points: 'bonus points',
  };

  return `Reach ${target} ${metricLabels[metric] || 'focus points'}`;
};

const buildQuest = (user, state, previousMetric = null) => {
  const metrics = getMetrics(user);
  const completedCount = toSafeNumber(state?.completedCount);
  const rotationIndex = completedCount % QUEST_ROTATION.length;
  let metric = QUEST_ROTATION[rotationIndex];

  if (metric === previousMetric) {
    metric = QUEST_ROTATION[(rotationIndex + 1) % QUEST_ROTATION.length];
  }

  const target = buildQuestTarget(metric, metrics, completedCount);
  const reward = getRewardPack(metric, completedCount);
  const current = metrics[metric];

  return {
    id: `quest-${completedCount + 1}-${metric}`,
    metric,
    title: buildQuestTitle(metric, target),
    label: `${formatDeltaText(metric, target, current)} to unlock ${reward.label}`,
    target,
    current,
    progress: Math.min(100, Math.round((current / Math.max(1, target)) * 100)),
    done: current >= target,
    reward,
    completedCount,
    createdAt: new Date().toISOString(),
  };
};

const normalizeQuestState = (user) => {
  const source = user?.questState && typeof user.questState === 'object' ? user.questState : DEFAULT_STATE();

  return {
    active: source.active || null,
    completedCount: toSafeNumber(source.completedCount),
    rewards: Array.isArray(source.rewards) ? source.rewards.slice(0, MAX_REWARDS) : [],
    history: Array.isArray(source.history) ? source.history.slice(0, MAX_HISTORY) : [],
    lastCompletedAt: source.lastCompletedAt || null,
  };
};

const ensureQuestState = (user) => {
  const state = normalizeQuestState(user);

  if (!state.active) {
    state.active = buildQuest(user, state, null);
  } else {
    const metrics = getMetrics(user);
    const current = metrics[state.active.metric] || 0;
    state.active = {
      ...state.active,
      current,
      progress: Math.min(100, Math.round((current / Math.max(1, Number(state.active.target) || 1)) * 100)),
      done: current >= Number(state.active.target || 0),
    };
  }

  return state;
};

const advanceQuestState = (user, eventAt = new Date()) => {
  if (!user) return null;

  const state = ensureQuestState(user);
  const metrics = getMetrics(user);
  const active = state.active;

  if (!active) {
    user.questState = state;
    return state;
  }

  const currentValue = metrics[active.metric] || 0;
  const target = Math.max(1, Number(active.target) || 1);
  const progress = Math.min(100, Math.round((currentValue / target) * 100));

  active.current = currentValue;
  active.progress = progress;
  active.done = currentValue >= target;

  if (active.done && !active.completedAt) {
    const completedAt = eventAt instanceof Date ? eventAt.toISOString() : new Date(eventAt).toISOString();
    const reward = active.reward || getRewardPack(active.metric, state.completedCount);

    user.points = toSafeNumber(user.points) + toSafeNumber(reward.pointsBonus);

    state.completedCount += 1;
    state.lastCompletedAt = completedAt;
    state.history = [
      {
        id: `${active.id}-completed`,
        title: active.title,
        rewardLabel: reward.label,
        rewardIcon: reward.icon,
        rewardKind: reward.kind,
        completedAt,
      },
      ...state.history,
    ].slice(0, MAX_HISTORY);

    state.rewards = [
      {
        id: `${active.id}-reward`,
        kind: reward.kind,
        label: reward.label,
        icon: reward.icon,
        description: reward.description,
        pointsBonus: toSafeNumber(reward.pointsBonus),
        grantedAt: completedAt,
        questId: active.id,
      },
      ...state.rewards,
    ].slice(0, MAX_REWARDS);

    state.active = buildQuest(user, state, active.metric);
  }

  user.questState = state;
  return state;
};

const getQuestStateSnapshot = (user) => ensureQuestState(user);

module.exports = {
  advanceQuestState,
  getQuestStateSnapshot,
};