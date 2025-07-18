import { RequestHandler } from "express";
import multer from "multer";

// Configure multer for handling audio uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

interface VoiceVerificationRequest {
  userId: string;
  transactionId: string;
  expectedPhrase: string;
}

interface VoiceVerificationResponse {
  success: boolean;
  confidence: number;
  message: string;
  emotionalState: string;
  verificationId: string;
}

// Store user voice profiles (in production, this would be in a database)
const userVoiceProfiles = new Map<
  string,
  {
    voiceprint: string;
    registeredPhrase: string;
    confidenceHistory: number[];
  }
>();

// Simulate voice biometric analysis
function analyzeVoiceBiometrics(
  audioBuffer: Buffer,
  expectedPhrase: string,
  userId: string,
): {
  biometricMatch: boolean;
  confidence: number;
  emotionalState: string;
} {
  // Simulate advanced voice analysis
  const audioQuality = Math.random() * 0.3 + 0.7; // 0.7-1.0
  const baseConfidence = Math.random() * 0.4 + 0.6; // 0.6-1.0

  // Check if user has a voice profile
  const userProfile = userVoiceProfiles.get(userId);
  let biometricBonus = 0;

  if (userProfile) {
    // Simulate comparing against stored voiceprint
    biometricBonus = Math.random() * 0.2; // Up to 20% bonus for registered users
  } else {
    // First-time user, create a profile
    userVoiceProfiles.set(userId, {
      voiceprint: `voiceprint_${userId}_${Date.now()}`,
      registeredPhrase: expectedPhrase,
      confidenceHistory: [],
    });
  }

  const finalConfidence = Math.min(
    0.98,
    (baseConfidence + biometricBonus) * audioQuality,
  );
  const biometricMatch = finalConfidence > 0.65;

  // Simulate emotional state detection
  const emotionalStates = ["calm", "confident", "nervous", "stressed"];
  let emotionalState =
    emotionalStates[Math.floor(Math.random() * emotionalStates.length)];

  // Adjust based on confidence
  if (finalConfidence > 0.85) emotionalState = "confident";
  else if (finalConfidence < 0.5) emotionalState = "stressed";

  // Update user profile
  if (userProfile) {
    userProfile.confidenceHistory.push(finalConfidence);
    if (userProfile.confidenceHistory.length > 10) {
      userProfile.confidenceHistory.shift(); // Keep only last 10
    }
  }

  return {
    biometricMatch,
    confidence: finalConfidence,
    emotionalState,
  };
}

export const handleVoiceVerification: RequestHandler = async (req, res) => {
  try {
    upload.single("audio")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
          confidence: 0,
          emotionalState: "unknown",
          verificationId: "",
        });
      }

      const { userId, transactionId, expectedPhrase } =
        req.body as VoiceVerificationRequest;
      const audioFile = req.file;

      if (!audioFile) {
        return res.status(400).json({
          success: false,
          message: "No audio file provided",
          confidence: 0,
          emotionalState: "unknown",
          verificationId: "",
        });
      }

      if (!userId || !transactionId || !expectedPhrase) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: userId, transactionId, or expectedPhrase",
          confidence: 0,
          emotionalState: "unknown",
          verificationId: "",
        });
      }

      console.log(
        `🎤 Voice verification requested for user ${userId}, transaction ${transactionId}`,
      );
      console.log(`📝 Expected phrase: "${expectedPhrase}"`);
      console.log(
        `🔊 Audio file received: ${audioFile.size} bytes, type: ${audioFile.mimetype}`,
      );

      // Simulate processing delay
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 2000),
      );

      // Analyze voice biometrics
      const analysis = analyzeVoiceBiometrics(
        audioFile.buffer,
        expectedPhrase,
        userId,
      );

      const verificationId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      let message = "";
      if (analysis.biometricMatch) {
        message = `Voice verified successfully! Biometric match confirmed with ${(analysis.confidence * 100).toFixed(1)}% confidence. Emotional state: ${analysis.emotionalState}.`;
      } else if (analysis.emotionalState === "stressed") {
        message = `Voice verification failed. Emotional stress detected (${analysis.emotionalState}). This may indicate coercion. Security review required.`;
      } else {
        message = `Voice verification failed. Biometric pattern doesn't match registered profile. Confidence: ${(analysis.confidence * 100).toFixed(1)}%.`;
      }

      const response: VoiceVerificationResponse = {
        success: analysis.biometricMatch,
        confidence: analysis.confidence * 100,
        message,
        emotionalState: analysis.emotionalState,
        verificationId,
      };

      console.log(
        `✅ Voice verification result: ${analysis.biometricMatch ? "SUCCESS" : "FAILED"} (${(analysis.confidence * 100).toFixed(1)}%)`,
      );

      res.json(response);
    });
  } catch (error) {
    console.error("Voice verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during voice verification",
      confidence: 0,
      emotionalState: "unknown",
      verificationId: "",
    });
  }
};

// Get user voice profile
export const getUserVoiceProfile: RequestHandler = (req, res) => {
  const { userId } = req.params;

  const profile = userVoiceProfiles.get(userId);

  if (!profile) {
    return res.status(404).json({
      exists: false,
      message: "No voice profile found for this user",
    });
  }

  const avgConfidence =
    profile.confidenceHistory.length > 0
      ? profile.confidenceHistory.reduce((a, b) => a + b, 0) /
        profile.confidenceHistory.length
      : 0;

  res.json({
    exists: true,
    registeredPhrase: profile.registeredPhrase,
    averageConfidence: avgConfidence * 100,
    verificationHistory: profile.confidenceHistory.length,
    message: "Voice profile found",
  });
};
