import rateLimit from "express-rate-limit";
import { HTTPSTATUS } from "../config/http.config";

export const aiGenerateRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many AI generation requests. Please try again later.",
  },
  handler: (_req, res) => {
    res.status(HTTPSTATUS.TOO_MANY_REQUESTS).json({
      message: "Too many AI generation requests. Please try again later.",
    });
  },
});
