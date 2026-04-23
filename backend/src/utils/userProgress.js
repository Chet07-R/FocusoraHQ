const getUtcDateOnly = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const dayDiffUtc = (a, b) => {
  const ms = getUtcDateOnly(a).getTime() - getUtcDateOnly(b).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
};

const applyFocusProgress = (
  user,
  { points = 0, studyMinutes = 0, sessionsCount = 0, eventAt = new Date() } = {}
) => {
  const safePoints = Math.max(0, Math.floor(Number(points) || 0));
  const safeStudyMinutes = Math.max(0, Math.floor(Number(studyMinutes) || 0));
  const safeSessionsCount = Math.max(0, Math.floor(Number(sessionsCount) || 0));

  user.points = (user.points || 0) + safePoints;
  user.totalStudyMinutes = (user.totalStudyMinutes || 0) + safeStudyMinutes;
  user.sessionsCount = (user.sessionsCount || 0) + safeSessionsCount;

  const lastFocusDate = user.lastFocusDate ? new Date(user.lastFocusDate) : null;
  if (!lastFocusDate) {
    user.focusStreak = 1;
  } else {
    const diffDays = dayDiffUtc(eventAt, lastFocusDate);
    if (diffDays === 1) {
      user.focusStreak = (user.focusStreak || 0) + 1;
    } else if (diffDays > 1) {
      user.focusStreak = 1;
    }
  }

  user.lastFocusDate = eventAt;
  user.bestFocusStreak = Math.max(user.bestFocusStreak || 0, user.focusStreak || 0);

  return user;
};

module.exports = { applyFocusProgress };
