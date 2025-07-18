import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleVoiceVerification,
  getUserVoiceProfile,
} from "./routes/voice-verification";
import {
  generateOTPHandler,
  verifyOTPHandler,
  getOTPStatus,
} from "./routes/otp-verification";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Voice Verification API
  app.post("/api/voice/verify", handleVoiceVerification);
  app.get("/api/voice/profile/:userId", getUserVoiceProfile);

  // OTP Generation & Verification API
  app.post("/api/otp/generate", generateOTPHandler);
  app.post("/api/otp/verify", verifyOTPHandler);
  app.get("/api/otp/status/:userId/:transactionId", getOTPStatus);

  return app;
}
