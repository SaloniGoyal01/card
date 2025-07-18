import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Mail,
  Smartphone,
} from "lucide-react";

interface OTPVerificationProps {
  transactionId?: string;
  amount?: number;
  onVerificationComplete: (success: boolean) => void;
  onCancel?: () => void;
}

export function OTPVerification({
  transactionId,
  amount,
  onVerificationComplete,
  onCancel,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isExpired, setIsExpired] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Generate OTP on component mount
  useEffect(() => {
    generateNewOtp();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
    }
  }, [timeLeft, isExpired]);

  const generateNewOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setTimeLeft(300);
    setIsExpired(false);
    setVerificationResult(null);
    setAttempts(0);
    setOtp("");

    // In a real app, this would be sent via SMS/Email
    console.log("Generated OTP:", newOtp);

    // Show OTP immediately for demo purposes with better UI
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-security-600 text-white p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right";
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div>
          <div class="font-semibold">OTP Sent!</div>
          <div class="text-sm">Your code: <span class="font-mono text-lg">${newOtp}</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setVerificationResult({
        success: false,
        message: "Please enter a valid 6-digit OTP",
      });
      return;
    }

    if (isExpired) {
      setVerificationResult({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
      return;
    }

    setIsVerifying(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isValid = otp === generatedOtp;
    setAttempts((prev) => prev + 1);

    if (isValid) {
      setVerificationResult({
        success: true,
        message: "OTP verified successfully! Transaction approved.",
      });
      setTimeout(() => {
        onVerificationComplete(true);
      }, 1500);
    } else {
      setVerificationResult({
        success: false,
        message: `Invalid OTP. ${3 - attempts} attempts remaining.`,
      });

      if (attempts >= 2) {
        setVerificationResult({
          success: false,
          message:
            "Too many failed attempts. Transaction blocked for security.",
        });
        setTimeout(() => {
          onVerificationComplete(false);
        }, 2000);
      }
    }

    setIsVerifying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setVerificationResult(null);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="border-security-200 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-security-100 to-security-200 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-security-600" />
          </div>
          <div>
            <CardTitle className="text-2xl text-security-900">
              OTP Verification
            </CardTitle>
            <p className="text-security-600 mt-2">
              Enter the 6-digit code sent to your registered device
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transaction Details */}
          {transactionId && amount && (
            <div className="p-4 bg-security-50 rounded-lg border border-security-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-security-600">Transaction ID:</span>
                  <span className="font-mono text-security-800">
                    {transactionId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-security-600">Amount:</span>
                  <span className="font-semibold text-security-800">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timer */}
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-4 w-4 text-security-600" />
            <span
              className={`font-mono text-lg ${timeLeft < 60 ? "text-danger" : "text-security-700"}`}
            >
              {formatTime(timeLeft)}
            </span>
            {isExpired && (
              <Badge className="bg-danger/10 text-danger border-danger/20 ml-2">
                Expired
              </Badge>
            )}
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              disabled={isExpired || verificationResult?.success}
            />
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <Alert
              className={`border ${
                verificationResult.success
                  ? "border-success/20 bg-success/5"
                  : "border-danger/20 bg-danger/5"
              }`}
            >
              {verificationResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-danger" />
              )}
              <AlertDescription
                className={
                  verificationResult.success ? "text-success" : "text-danger"
                }
              >
                {verificationResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={verifyOtp}
              disabled={
                isVerifying ||
                !otp ||
                otp.length !== 6 ||
                isExpired ||
                verificationResult?.success
              }
              className="w-full bg-security-600 hover:bg-security-700"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify OTP
                </>
              )}
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={generateNewOtp}
                disabled={isVerifying || !isExpired}
                className="flex-1 border-security-300 text-security-700 hover:bg-security-50"
              >
                <Mail className="mr-2 h-4 w-4" />
                Resend OTP
              </Button>

              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isVerifying}
                  className="flex-1 text-security-600 hover:bg-security-50"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-security-600">
              Didn't receive the code?
            </p>
            <div className="flex justify-center space-x-4 text-xs">
              <span className="flex items-center space-x-1 text-security-500">
                <Smartphone className="h-3 w-3" />
                <span>Check SMS</span>
              </span>
              <span className="flex items-center space-x-1 text-security-500">
                <Mail className="h-3 w-3" />
                <span>Check Email</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
