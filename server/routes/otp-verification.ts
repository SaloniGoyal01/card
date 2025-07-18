import { RequestHandler } from "express";

interface OTPGenerationRequest {
  userId: string;
  transactionId: string;
  phoneNumber?: string;
  email?: string;
}

interface OTPVerificationRequest {
  userId: string;
  transactionId: string;
  otp: string;
}

interface OTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
  expiresAt?: string;
}

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<
  string,
  {
    otp: string;
    userId: string;
    transactionId: string;
    expiresAt: Date;
    attempts: number;
    maxAttempts: number;
  }
>();

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simulate sending OTP via SMS/Email
function sendOTP(
  otp: string,
  phoneNumber?: string,
  email?: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(
      () => {
        if (phoneNumber) {
          console.log(`📱 SMS OTP sent to ${phoneNumber}: ${otp}`);
          console.log(`📱 [DEMO] Your verification code is: ${otp}`);
        }

        if (email) {
          console.log(`📧 Email OTP sent to ${email}: ${otp}`);
          console.log(`📧 [DEMO] Your verification code is: ${otp}`);
        }

        // Always simulate successful sending
        resolve(true);
      },
      500 + Math.random() * 1000,
    );
  });
}

export const generateOTPHandler: RequestHandler = async (req, res) => {
  try {
    const { userId, transactionId, phoneNumber, email } =
      req.body as OTPGenerationRequest;

    if (!userId || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId or transactionId",
      });
    }

    if (!phoneNumber && !email) {
      return res.status(400).json({
        success: false,
        message: "Either phoneNumber or email must be provided",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const otpId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store OTP
    otpStore.set(otpId, {
      otp,
      userId,
      transactionId,
      expiresAt,
      attempts: 0,
      maxAttempts: 3,
    });

    console.log(
      `🔢 OTP generated for user ${userId}, transaction ${transactionId}: ${otp}`,
    );

    // Send OTP
    const sent = await sendOTP(otp, phoneNumber, email);

    if (!sent) {
      otpStore.delete(otpId);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    // Clean up expired OTPs
    setTimeout(
      () => {
        otpStore.delete(otpId);
        console.log(`🗑️ Expired OTP cleaned up: ${otpId}`);
      },
      5 * 60 * 1000,
    );

    const response: OTPResponse = {
      success: true,
      message: `OTP sent successfully to ${phoneNumber ? "your phone" : "your email"}`,
      otpId,
      expiresAt: expiresAt.toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during OTP generation",
    });
  }
};

export const verifyOTPHandler: RequestHandler = async (req, res) => {
  try {
    const { userId, transactionId, otp } = req.body as OTPVerificationRequest;

    if (!userId || !transactionId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, transactionId, or otp",
      });
    }

    // Find OTP in store
    let foundOtpId: string | null = null;
    let otpData = null;

    for (const [otpId, data] of otpStore.entries()) {
      if (data.userId === userId && data.transactionId === transactionId) {
        foundOtpId = otpId;
        otpData = data;
        break;
      }
    }

    if (!foundOtpId || !otpData) {
      return res.status(404).json({
        success: false,
        message: "No active OTP found for this transaction",
      });
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      otpStore.delete(foundOtpId);
      return res.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Increment attempts
    otpData.attempts += 1;

    console.log(
      `🔍 OTP verification attempt ${otpData.attempts}/${otpData.maxAttempts} for user ${userId}`,
    );

    // Check if too many attempts
    if (otpData.attempts > otpData.maxAttempts) {
      otpStore.delete(foundOtpId);
      return res.status(429).json({
        success: false,
        message:
          "Too many failed attempts. Transaction blocked for security. Please start over.",
      });
    }

    // Verify OTP
    const isValid = otp === otpData.otp;

    if (isValid) {
      // Success - remove OTP from store
      otpStore.delete(foundOtpId);
      console.log(`✅ OTP verified successfully for user ${userId}`);

      res.json({
        success: true,
        message: "OTP verified successfully! Transaction approved.",
      });
    } else {
      const remainingAttempts = otpData.maxAttempts - otpData.attempts;
      console.log(
        `❌ Invalid OTP for user ${userId}. ${remainingAttempts} attempts remaining.`,
      );

      res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during OTP verification",
    });
  }
};

// Get OTP status
export const getOTPStatus: RequestHandler = (req, res) => {
  const { userId, transactionId } = req.params;

  for (const [otpId, data] of otpStore.entries()) {
    if (data.userId === userId && data.transactionId === transactionId) {
      const isExpired = new Date() > data.expiresAt;
      const timeRemaining = Math.max(
        0,
        Math.floor((data.expiresAt.getTime() - Date.now()) / 1000),
      );

      return res.json({
        exists: true,
        expired: isExpired,
        attempts: data.attempts,
        maxAttempts: data.maxAttempts,
        timeRemaining,
        expiresAt: data.expiresAt.toISOString(),
      });
    }
  }

  res.status(404).json({
    exists: false,
    message: "No active OTP found for this transaction",
  });
};
