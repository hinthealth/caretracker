exports.required = function (req, res, next) {
  // see above
  res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');
  console.log('x-forwarded-proto is ');
  console.log(req.headers['x-forwarded-proto']);
  if (req.headers['x-forwarded-proto'] !== 'https') {
    console.log("redirecting...");
    return res.redirect(301, 'https://' + req.headers.host + '/');
  }
  next();
};
