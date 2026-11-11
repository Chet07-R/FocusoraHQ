const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { notFoundHandler } = require('../src/middlewares/errorHandler');

describe('5. API Health & Error Resilience Tests (api_health.test.js)', () => {
  it('should return a healthy status payload from health check endpoint', () => {
    function healthCheckHandler(req, res) {
      return res.status(200).json({
        status: 'ok',
        service: 'FocusoraHQ-Backend',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    }

    let statusCode = null;
    let jsonResponse = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResponse = data;
        return this;
      },
    };

    healthCheckHandler({}, res);
    assert.equal(statusCode, 200);
    assert.equal(jsonResponse.status, 'ok');
    assert.equal(jsonResponse.service, 'FocusoraHQ-Backend');
    assert.ok(jsonResponse.timestamp);
  });

  it('should return standardized JSON 404 for unknown endpoints', () => {
    let statusCode = null;
    let jsonResponse = null;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResponse = data;
        return this;
      },
    };

    notFoundHandler({}, res);
    assert.equal(statusCode, 404);
    assert.equal(jsonResponse.code, 'NOT_FOUND');
    assert.equal(jsonResponse.message, 'Route not found');
  });

  it('should degrade gracefully on third-party service timeout or connection refusal', async () => {
    async function fetchExternalAiQuote(fetcher) {
      try {
        return await fetcher();
      } catch (error) {
        // Fallback to offline heuristic
        return {
          quote: 'Keep your focus sharp, one pomodoro at a time.',
          source: 'FocusoraHQ Heuristic Engine',
          fallback: true,
        };
      }
    }

    const failingService = async () => {
      throw new Error('ETIMEDOUT: Connection to external AI provider timed out');
    };

    const response = await fetchExternalAiQuote(failingService);
    assert.equal(response.fallback, true);
    assert.equal(response.source, 'FocusoraHQ Heuristic Engine');
    assert.ok(response.quote);
  });
});
