import rateLimit from "express-rate-limit";

// Auth rate limiter (e.g. max 20 requests per 15 minutes per IP for login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    message: "Too many login/registration attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
