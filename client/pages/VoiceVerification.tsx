import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { OTPVerification } from "@/components/OTPVerification";
import {
  Mic,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  User,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
}

export default function VoiceVerification() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [secretPhrase] = useState(
    "My voice is my password verify one two three",
  );
  const [verificationResults, setVerificationResults] = useState({
    voice: { completed: false, success: false, confidence: 0 },
    otp: { completed: false, success: false },
  });

  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: "identity",
      title: "Identity Verification",
      description: "Verify your identity before starting voice verification",
      status: "completed",
    },
    {
      id: "voice",
      title: "Voice Biometric Scan",
      description: "Record your secret phrase for biometric verification",
      status: "in_progress",
    },
    {
      id: "otp",
      title: "OTP Confirmation",
      description: "Enter the OTP sent to your registered device",
      status: "pending",
    },
    {
      id: "complete",
      title: "Verification Complete",
      description: "Access granted to fraud detection system",
      status: "pending",
    },
  ]);

  const [transactionContext] = useState({
    id: "TXN_VOICE_001",
    amount: 2450.0,
    location: "International Transaction",
    flaggedReason: "High amount + unusual location",
  });

  const startVoiceVerification = () => {
    setShowVoiceRecorder(true);
  };

  const handleVoiceComplete = (success: boolean, confidence?: number) => {
    setVerificationResults((prev) => ({
      ...prev,
      voice: { completed: true, success, confidence: confidence || 0 },
    }));

    setSteps((prev) =>
      prev.map((step) =>
        step.id === "voice"
          ? { ...step, status: success ? "completed" : "failed" }
          : step.id === "otp" && success
            ? { ...step, status: "in_progress" }
            : step,
      ),
    );

    setShowVoiceRecorder(false);
    setCurrentStep(2);

    if (success) {
      // Auto-start OTP verification
      setTimeout(() => {
        setShowOtpVerification(true);
      }, 1500);
    }
  };

  const handleOtpComplete = (success: boolean) => {
    setVerificationResults((prev) => ({
      ...prev,
      otp: { completed: true, success },
    }));

    setSteps((prev) =>
      prev.map((step) =>
        step.id === "otp"
          ? { ...step, status: success ? "completed" : "failed" }
          : step.id === "complete" && success
            ? { ...step, status: "completed" }
            : step,
      ),
    );

    setShowOtpVerification(false);
    setCurrentStep(3);

    if (success) {
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    }
  };

  const getStepIcon = (step: VerificationStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-danger" />;
      case "in_progress":
        return <RefreshCw className="h-5 w-5 text-security-600 animate-spin" />;
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-security-300" />
        );
    }
  };

  const getStepStatus = (step: VerificationStep) => {
    switch (step.status) {
      case "completed":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-danger/10 text-danger border-danger/20">
            Failed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-security/10 text-security-600 border-security/20">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (showVoiceRecorder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-security-900 mb-2">
            Voice Biometric Verification
          </h1>
          <p className="text-security-600">
            Please record your secret phrase clearly and naturally
          </p>
        </div>
        <VoiceRecorder
          secretPhrase={secretPhrase}
          onVerificationComplete={handleVoiceComplete}
          onCancel={() => setShowVoiceRecorder(false)}
        />
      </div>
    );
  }

  if (showOtpVerification) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-security-900 mb-2">
            OTP Verification Required
          </h1>
          <p className="text-security-600">
            Voice verification successful. Please complete OTP verification.
          </p>
        </div>
        <OTPVerification
          transactionId={transactionContext.id}
          amount={transactionContext.amount}
          onVerificationComplete={handleOtpComplete}
          onCancel={() => setShowOtpVerification(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-security-100 to-security-200 rounded-2xl flex items-center justify-center">
          <Mic className="h-10 w-10 text-security-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-security-900">
            Voice Verification & Emotional AI
          </h1>
          <p className="text-xl text-security-600 max-w-3xl mx-auto">
            Advanced voice biometric authentication with emotional state
            analysis for secure transaction verification
          </p>
        </div>
      </div>

      {/* Transaction Context */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            <span>Transaction Flagged for Additional Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-security-600">Transaction ID:</span>
                <span className="font-mono text-security-800">
                  {transactionContext.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-security-600">Amount:</span>
                <span className="font-semibold text-security-800">
                  ${transactionContext.amount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-security-600">Location:</span>
                <span className="text-security-800">
                  {transactionContext.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-security-600">Flag Reason:</span>
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  {transactionContext.flaggedReason}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-security-600" />
            <span>Multi-Factor Verification Process</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">{getStepIcon(step)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-security-800">
                      {step.title}
                    </h3>
                    {getStepStatus(step)}
                  </div>
                  <p className="text-sm text-security-600 mt-1">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-8 w-px bg-security-200" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Action */}
      {currentStep === 1 && !showVoiceRecorder && (
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-security-600" />
              <span>Voice Biometric Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-security-200 bg-security-50">
              <Volume2 className="h-4 w-4 text-security-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-security-800">
                    Your Secret Phrase:
                  </p>
                  <p className="text-lg font-semibold text-security-900 p-3 bg-white rounded border border-security-200">
                    "{secretPhrase}"
                  </p>
                  <p className="text-sm text-security-600">
                    Please ensure you're in a quiet environment and speak
                    clearly.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h4 className="font-semibold text-security-800">
                Voice Verification Features:
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-security-700">
                      Voice biometric matching
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-security-700">
                      Emotional state analysis
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-security-700">
                      Anti-spoofing protection
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-security-700">
                      Stress detection
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-security-700">
                      Coercion analysis
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-security-700">
                      Real-time processing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={startVoiceVerification}
              className="w-full bg-security-600 hover:bg-security-700"
              size="lg"
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Voice Verification
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Verification Results */}
      {(verificationResults.voice.completed ||
        verificationResults.otp.completed) && (
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>Verification Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationResults.voice.completed && (
              <div className="p-4 rounded-lg border border-security-200 bg-security-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-security-800">
                    Voice Verification:
                  </span>
                  <Badge
                    className={
                      verificationResults.voice.success
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-danger/10 text-danger border-danger/20"
                    }
                  >
                    {verificationResults.voice.success ? "Passed" : "Failed"}
                  </Badge>
                </div>
                {verificationResults.voice.success && (
                  <div className="text-sm text-security-600 mt-1">
                    Confidence:{" "}
                    {verificationResults.voice.confidence.toFixed(1)}%
                  </div>
                )}
              </div>
            )}

            {verificationResults.otp.completed && (
              <div className="p-4 rounded-lg border border-security-200 bg-security-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-security-800">
                    OTP Verification:
                  </span>
                  <Badge
                    className={
                      verificationResults.otp.success
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-danger/10 text-danger border-danger/20"
                    }
                  >
                    {verificationResults.otp.success ? "Passed" : "Failed"}
                  </Badge>
                </div>
              </div>
            )}

            {verificationResults.voice.success &&
              verificationResults.otp.success && (
                <Alert className="border-success/20 bg-success/5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    <strong>Verification Complete!</strong> All security checks
                    passed. Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
