module.exports = (res, name, token, domain, path, secure, httpOnly, maxAge) => {
  res.cookie(name, token, {
    httpOnly,
    path,
    domain,
    secure,
    maxAge,
  });
};
