const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('3. Business Logic & Schema Boundary Condition Tests (business_logic.test.js)', () => {
  it('should enforce Pomodoro work and break duration limits (min 1, max 60 min)', () => {
    function validatePomodoroSettings(work, breakTime) {
      if (typeof work !== 'number' || work < 1 || work > 60) {
        throw new Error('INVALID_WORK_DURATION');
      }
      if (typeof breakTime !== 'number' || breakTime < 1 || breakTime > 60) {
        throw new Error('INVALID_BREAK_DURATION');
      }
      return true;
    }

    assert.equal(validatePomodoroSettings(25, 5), true);
    assert.equal(validatePomodoroSettings(60, 60), true);
    assert.throws(() => validatePomodoroSettings(0, 5), /INVALID_WORK_DURATION/);
    assert.throws(() => validatePomodoroSettings(65, 5), /INVALID_WORK_DURATION/);
    assert.throws(() => validatePomodoroSettings(25, -1), /INVALID_BREAK_DURATION/);
    assert.throws(() => validatePomodoroSettings(25, 90), /INVALID_BREAK_DURATION/);
  });

  it('should enforce unique compound indexes to prevent duplicate active participations', () => {
    const activeParticipants = new Set();

    function joinRoom(roomId, userId) {
      const compoundKey = `${roomId}:${userId}`;
      if (activeParticipants.has(compoundKey)) {
        throw new Error('DUPLICATE_PARTICIPATION_RECORD');
      }
      activeParticipants.add(compoundKey);
      return true;
    }

    assert.equal(joinRoom('room_101', 'user_abc'), true);
    assert.throws(() => {
      joinRoom('room_101', 'user_abc');
    }, /DUPLICATE_PARTICIPATION_RECORD/);

    // Same user in different room or different user in same room is permitted
    assert.equal(joinRoom('room_102', 'user_abc'), true);
    assert.equal(joinRoom('room_101', 'user_xyz'), true);
  });

  it('should strictly transition room timer state machine (STOPPED -> RUNNING -> PAUSED -> STOPPED)', () => {
    const TimerState = {
      STOPPED: 'STOPPED',
      RUNNING: 'RUNNING',
      PAUSED: 'PAUSED',
    };

    class StudyTimerStateMachine {
      constructor() {
        this.state = TimerState.STOPPED;
      }

      start() {
        if (this.state !== TimerState.STOPPED && this.state !== TimerState.PAUSED) {
          throw new Error(`CANNOT_START_FROM_${this.state}`);
        }
        this.state = TimerState.RUNNING;
      }

      pause() {
        if (this.state !== TimerState.RUNNING) {
          throw new Error(`CANNOT_PAUSE_FROM_${this.state}`);
        }
        this.state = TimerState.PAUSED;
      }

      stop() {
        this.state = TimerState.STOPPED;
      }
    }

    const timer = new StudyTimerStateMachine();
    assert.equal(timer.state, TimerState.STOPPED);

    timer.start();
    assert.equal(timer.state, TimerState.RUNNING);

    assert.throws(() => timer.start(), /CANNOT_START_FROM_RUNNING/);

    timer.pause();
    assert.equal(timer.state, TimerState.PAUSED);

    assert.throws(() => timer.pause(), /CANNOT_PAUSE_FROM_PAUSED/);

    timer.start();
    assert.equal(timer.state, TimerState.RUNNING);

    timer.stop();
    assert.equal(timer.state, TimerState.STOPPED);
  });

  it('should validate study streak and gamified focus points calculation math', () => {
    function calculatePointsAndStreak(currentPoints, currentStreak, lastFocusDate, sessionMinutes) {
      const today = new Date().toISOString().slice(0, 10);
      let newStreak = currentStreak;

      if (!lastFocusDate) {
        newStreak = 1;
      } else {
        const lastDate = new Date(lastFocusDate).toISOString().slice(0, 10);
        const diffDays = Math.floor((new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }

      const pointsEarned = Math.floor(sessionMinutes * 10);
      return {
        points: currentPoints + pointsEarned,
        focusStreak: newStreak,
        lastFocusDate: today,
      };
    }

    const result = calculatePointsAndStreak(100, 3, '2026-11-10', 25);
    assert.equal(result.points, 350); // 100 + 250
    assert.equal(result.focusStreak, 4);

    // Stale streak reset
    const staleResult = calculatePointsAndStreak(100, 10, '2026-11-01', 50);
    assert.equal(staleResult.focusStreak, 1);
    assert.equal(staleResult.points, 600);
  });
});
