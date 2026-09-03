/**
 * SQL / Query Injection Sanitizer Middleware
 * Detects and sanitizes SQL injection patterns, SQL meta-characters,
 * and malicious query payloads across req.body, req.query, and req.params.
 */

// Regular expressions detecting common SQL injection attack signatures
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b\s+)/i,
  /(\b(OR|AND)\b\s+[\w'"]+\s*=\s*[\w'"]+)/i,
  /(\b(OR|AND)\b\s+1\s*=\s*1)/i,
  /(--|#|\/\*|\*\/)/, // SQL comments
  /(;\s*(DROP|DELETE|UPDATE|INSERT|SELECT))/i, // Stacked queries
  /(\bxp_\w+)/i, // MSSQL extended stored procedures
  /(WAITFOR\s+DELAY)/i, // Blind SQLi time delay
  /('|\b)UNION(\s+ALL)?\s+SELECT/i,
];

const containsSqlInjection = (value) => {
  if (typeof value !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
};

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Strip dangerous comment indicators and trailing injection characters
    return value
      .replace(/(\/\*[\w\W]*?\*\/)/g, '')
      .replace(/(--[^\r\n]*)/g, '')
      .replace(/;\s*$/g, '')
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    const sanitizedObj = {};
    for (const [k, v] of Object.entries(value)) {
      // Prevent MongoDB / NoSQL $operator injection
      const cleanKey = k.replace(/^\$/, '');
      sanitizedObj[cleanKey] = sanitizeValue(v);
    }
    return sanitizedObj;
  }

  return value;
};

const sqlInjectionSanitizer = (options = { blockOnThreat: false }) => {
  return (req, res, next) => {
    try {
      const targets = ['body', 'query', 'params'];

      for (const target of targets) {
        if (req[target]) {
          // Optional strict blocking on obvious malicious injections
          if (options.blockOnThreat) {
            const hasThreat = (obj) => {
              if (typeof obj === 'string') return containsSqlInjection(obj);
              if (Array.isArray(obj)) return obj.some(hasThreat);
              if (obj && typeof obj === 'object') return Object.values(obj).some(hasThreat);
              return false;
            };

            if (hasThreat(req[target])) {
              return res.status(403).json({
                code: 'POTENTIAL_SQL_INJECTION',
                message: 'Request blocked due to potential malicious query pattern.',
              });
            }
          }

          // Sanitize incoming payload
          req[target] = sanitizeValue(req[target]);
        }
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = {
  sqlInjectionSanitizer,
  containsSqlInjection,
  sanitizeValue,
};
