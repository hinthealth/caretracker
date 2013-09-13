exports.required = function (req, res, next) {
  // see above
  res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, 'https://' + req.headers.host + '/');
  }
  next();
};
