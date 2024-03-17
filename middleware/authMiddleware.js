const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token is missing" });
    }

    const token = authorizationHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_value",
      (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decodedToken;
        next();
      }
    );
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
