export const POINT_RULES = Object.freeze({
  pomodoroPerMinute: 1,
  notesSave: 1,
  taskAdded: 1,
  taskCompleted: 2,
});

export const getPomodoroPoints = (durationMinutes = 0) => {
  const safeMinutes = Math.max(0, Math.floor(Number(durationMinutes) || 0));
  return safeMinutes * POINT_RULES.pomodoroPerMinute;
};
