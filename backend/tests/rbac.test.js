const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('2. Role-Based Access Control & Authorization Tests (rbac.test.js)', () => {
  const requireRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient administrative privileges' });
    }
    return next();
  };

  it('should block regular users from accessing administrative endpoints with HTTP 403', () => {
    const regularUserReq = { user: { id: 'usr_reg_01', role: 'user' } };
    let statusSent = null;
    let jsonSent = null;

    const res = {
      status(code) {
        statusSent = code;
        return this;
      },
      json(payload) {
        jsonSent = payload;
        return this;
      },
    };

    const adminGuard = requireRole(['admin', 'superadmin']);
    adminGuard(regularUserReq, res, () => {
      assert.fail('Should not call next() for non-admin');
    });

    assert.equal(statusSent, 403);
    assert.equal(jsonSent.error, 'FORBIDDEN');
  });

  it('should allow administrative users to access protected routes', () => {
    const adminReq = { user: { id: 'usr_adm_99', role: 'admin' } };
    let nextCalled = false;
    const res = {};

    const adminGuard = requireRole(['admin']);
    adminGuard(adminReq, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });

  it('should prevent multi-tenant boundary cross-access between different workspaces/users', () => {
    const studyRoomsStore = [
      { id: 'room_alpha', createdBy: 'tenant_A', name: 'MIT Algorithms Hall' },
      { id: 'room_beta', createdBy: 'tenant_B', name: 'Stanford ML Lab' },
    ];

    function deleteRoom(requestingUserId, roomId) {
      const room = studyRoomsStore.find(r => r.id === roomId);
      if (!room) throw new Error('ROOM_NOT_FOUND');
      if (room.createdBy !== requestingUserId) {
        throw new Error('ACCESS_DENIED_TENANT_BOUNDARY');
      }
      return true;
    }

    assert.throws(() => {
      deleteRoom('tenant_A', 'room_beta');
    }, /ACCESS_DENIED_TENANT_BOUNDARY/);

    assert.equal(deleteRoom('tenant_A', 'room_alpha'), true);
  });

  it('should defend against role elevation attacks during profile updates', () => {
    const sanitizeProfilePayload = (body) => {
      const immutableFields = ['role', 'isAdmin', 'points', 'totalStudyMinutes', 'isEmailVerified'];
      const sanitized = {};
      for (const [key, value] of Object.entries(body)) {
        if (!immutableFields.includes(key)) {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    const attackerPayload = {
      displayName: 'Legit User',
      bio: 'Studying for finals',
      role: 'admin',
      isAdmin: true,
      points: 999999,
    };

    const safeData = sanitizeProfilePayload(attackerPayload);
    assert.equal(safeData.displayName, 'Legit User');
    assert.equal(safeData.bio, 'Studying for finals');
    assert.equal(safeData.role, undefined);
    assert.equal(safeData.isAdmin, undefined);
    assert.equal(safeData.points, undefined);
  });
});
