const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config/env");
const { HttpError } = require("../utils/httpError");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authorization token is required"));
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

module.exports = { authenticate };
