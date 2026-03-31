const ok = (res, data, status = 200) => {
  return res.status(status).json(data);
};

const fail = (res, status, code, message, details) => {
  return res.status(status).json({
    code,
    message,
    ...(details ? { details } : {}),
  });
};

module.exports = { ok, fail };
