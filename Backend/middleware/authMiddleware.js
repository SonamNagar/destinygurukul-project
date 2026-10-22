import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Pehle httpOnly cookie se token lo
    let token = req.cookies?.accessToken;

    // Cookie nahi mili toh Authorization header check karo (fallback)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "Authorization token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

export default authMiddleware;