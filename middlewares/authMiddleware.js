const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticateUser = (req, res, next) => {
  const token = req.cookies.login_token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, Please login" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: `Forbidden: ${err.message}` });
    }
    req.user = decoded;
    next();
  });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized, Please login" });
        }
        const hasRole = roles.includes(req.user.role);
        if (!hasRole) {
            return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource" });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRoles };
