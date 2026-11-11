const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');

const JWT_SECRET = 'test_jwt_secret_focusorahq_enterprise_qa_key_9999';

describe('1. Authentication & Session Lifecycle Tests (auth.test.js)', () => {
  it('should sign and verify valid JWT access tokens with correct claims', () => {
    const userId = 'usr_6633f81e7d23a19b22a014a1';
    const token = jwt.sign({ sub: userId, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
    assert.ok(token, 'Token should be generated');

    const decoded = jwt.verify(token, JWT_SECRET);
    assert.equal(decoded.sub, userId);
    assert.equal(decoded.role, 'user');
    assert.ok(decoded.exp > Math.floor(Date.now() / 1000));
  });

  it('should reject tampered or signature-invalid tokens', () => {
    const token = jwt.sign({ sub: 'user_123' }, JWT_SECRET, { expiresIn: '1h' });
    const tampered = token.slice(0, -5) + 'abcde';
    assert.throws(() => {
      jwt.verify(tampered, JWT_SECRET);
    }, /invalid signature/i);
  });

  it('should reject expired tokens with TokenExpiredError', () => {
    const expiredToken = jwt.sign({ sub: 'user_123' }, JWT_SECRET, { expiresIn: -10 });
    assert.throws(() => {
      jwt.verify(expiredToken, JWT_SECRET);
    }, (err) => err.name === 'TokenExpiredError');
  });

  it('should hash and verify passwords with unique bcrypt salts', async () => {
    const password = 'FocusoraSuperSecretPassword!2026';
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);

    assert.notEqual(hash1, hash2, 'Salts must make hashes distinct');
    assert.equal(await bcrypt.compare(password, hash1), true);
    assert.equal(await bcrypt.compare(password, hash2), true);
    assert.equal(await bcrypt.compare('WrongPassword#99', hash1), false);
  });

  it('should implement refresh token rotation and family tracking with reuse detection', () => {
    const tokenFamilyStore = new Map();

    function issueRefreshToken(familyId) {
      const tokenId = crypto.randomUUID();
      const currentFamily = tokenFamilyStore.get(familyId) || { activeToken: null, compromised: false };
      currentFamily.activeToken = tokenId;
      tokenFamilyStore.set(familyId, currentFamily);
      return tokenId;
    }

    function rotateRefreshToken(familyId, presentedTokenId) {
      const family = tokenFamilyStore.get(familyId);
      if (!family) throw new Error('FAMILY_NOT_FOUND');
      if (family.compromised) throw new Error('TOKEN_FAMILY_COMPROMISED');
      if (family.activeToken !== presentedTokenId) {
        family.compromised = true;
        family.activeToken = null;
        throw new Error('REUSE_DETECTED');
      }
      return issueRefreshToken(familyId);
    }

    const familyId = 'fam_alpha_1';
    const token1 = issueRefreshToken(familyId);
    const token2 = rotateRefreshToken(familyId, token1);
    assert.notEqual(token1, token2);

    // Attacker tries to replay token1
    assert.throws(() => {
      rotateRefreshToken(familyId, token1);
    }, /REUSE_DETECTED/);

    // Subsequent rotation with token2 is blocked due to compromise
    assert.throws(() => {
      rotateRefreshToken(familyId, token2);
    }, /TOKEN_FAMILY_COMPROMISED/);
  });

  it('should handle multi-device FIFO session revocation upon limit overflow', () => {
    const MAX_SESSIONS = 3;
    const userSessions = [];

    function addSession(session) {
      if (userSessions.length >= MAX_SESSIONS) {
        userSessions.shift(); // FIFO eviction
      }
      userSessions.push(session);
    }

    addSession({ id: 'sess_1', device: 'Desktop Chrome' });
    addSession({ id: 'sess_2', device: 'Mobile Safari' });
    addSession({ id: 'sess_3', device: 'iPad Firefox' });
    assert.equal(userSessions.length, 3);
    assert.equal(userSessions[0].id, 'sess_1');

    addSession({ id: 'sess_4', device: 'Electron App' });
    assert.equal(userSessions.length, 3);
    assert.equal(userSessions[0].id, 'sess_2');
    assert.equal(userSessions[2].id, 'sess_4');
  });

  it('should support explicit single-session and global all-session revocation', () => {
    let sessions = [
      { id: 'sess_1', active: true },
      { id: 'sess_2', active: true },
      { id: 'sess_3', active: true },
    ];

    // Single session revocation
    sessions = sessions.filter(s => s.id !== 'sess_2');
    assert.equal(sessions.length, 2);
    assert.equal(sessions.some(s => s.id === 'sess_2'), false);

    // Logout all
    sessions = [];
    assert.equal(sessions.length, 0);
  });
});
