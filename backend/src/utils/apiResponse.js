const ok = (res, data, status = 200) => {
  return res.status(status).json(data);
};

const fail = (res, status, code, message, details) => {
  const requestId = res.locals?.requestId;

  return res.status(status).json({
    code,
    message,
    ...(details ? { details } : {}),
    ...(requestId ? { requestId } : {}),
  });
};

module.exports = { ok, fail };
