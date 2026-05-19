const jwt = require("jsonwebtoken");

// This middleware runs before any protected route handler.
// It checks that the request has a valid JWT token.
// If not, it blocks the request with a 401 error.

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token must be sent as: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    next();             // allow the request to continue
  } catch (error) {
    return res.status(401).json({ message: "Not authorized. Token is invalid or expired." });
  }
};

module.exports = protect;
