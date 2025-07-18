import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Mic,
  MicOff,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Clock,
  Volume2,
  RefreshCw,
  Loader2,
  Ban,
  Lock,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  location: string;
  timestamp: string;
  riskLevel: "low" | "medium" | "high";
  riskFactors: string[];
}

interface VoiceVerificationResult {
  success: boolean;
  confidence: number;
  message: string;
  emotionalState: string;
  verificationId: string;
}

interface OTPResult {
  success: boolean;
  message: string;
  otpId?: string;
  expiresAt?: string;
}

export default function TransactionVerification() {
  // Transaction data
  const [transaction] = useState<Transaction>({
    id: "TXN_HIGH_RISK_001",
    amount: 2500.0,
    location: "International Transaction - Unknown Location",
    timestamp: new Date().toISOString().replace("T", " ").split(".")[0],
    riskLevel: "high",
    riskFactors: [
      "High amount",
      "International transaction",
      "Unknown location",
      "Rapid succession",
    ],
  });

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isVerifyingVoice, setIsVerifyingVoice] = useState(false);
  const [voiceResult, setVoiceResult] =
    useState<VoiceVerificationResult | null>(null);

  // OTP State
  const [otp, setOtp] = useState("");
  const [isGeneratingOTP, setIsGeneratingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpResult, setOtpResult] = useState<OTPResult | null>(null);
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);

  // General State
  const [currentStep, setCurrentStep] = useState<
    "initial" | "voice" | "otp" | "complete"
  >("initial");
  const [overallSuccess, setOverallSuccess] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const secretPhrase = "My voice is my password verify one two three";
  const userId = "user_demo_123";

  // Cleanup function
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // OTP Timer
  useEffect(() => {
    if (otpTimeLeft > 0) {
      const timer = setTimeout(() => setOtpTimeLeft(otpTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimeLeft]);

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : undefined,
      });
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: mediaRecorder.mimeType || "audio/wav",
        });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  };

  const verifyVoice = async () => {
    if (!audioBlob) return;

    setIsVerifyingVoice(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice-recording.wav");
      formData.append("userId", userId);
      formData.append("transactionId", transaction.id);
      formData.append("expectedPhrase", secretPhrase);

      const response = await fetch("/api/voice/verify", {
        method: "POST",
        body: formData,
      });

      const result: VoiceVerificationResult = await response.json();
      setVoiceResult(result);

      if (result.success) {
        setCurrentStep("otp");
        // Auto-generate OTP after successful voice verification
        setTimeout(() => {
          generateOTP();
        }, 1500);
      }
    } catch (error) {
      console.error("Voice verification error:", error);
      setVoiceResult({
        success: false,
        confidence: 0,
        message: "Network error during voice verification. Please try again.",
        emotionalState: "unknown",
        verificationId: "",
      });
    } finally {
      setIsVerifyingVoice(false);
    }
  };

  // OTP Functions
  const generateOTP = async () => {
    setIsGeneratingOTP(true);

    try {
      const response = await fetch("/api/otp/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          transactionId: transaction.id,
          phoneNumber: "+1-555-123-4567", // Demo phone
          email: "user@example.com", // Demo email
        }),
      });

      const result: OTPResult = await response.json();
      setOtpResult(result);

      if (result.success) {
        setOtpTimeLeft(300); // 5 minutes
        setOtpAttempts(0);
      }
    } catch (error) {
      console.error("OTP generation error:", error);
      setOtpResult({
        success: false,
        message: "Network error during OTP generation. Please try again.",
      });
    } finally {
      setIsGeneratingOTP(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifyingOTP(true);

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          transactionId: transaction.id,
          otp,
        }),
      });

      const result: OTPResult = await response.json();

      if (result.success) {
        setOverallSuccess(true);
        setCurrentStep("complete");
      } else {
        setOtpAttempts((prev) => prev + 1);
        alert(result.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Network error during OTP verification. Please try again.");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      default:
        return "text-success";
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return (
          <Badge className="bg-danger/10 text-danger border-danger/20">
            High Risk
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Medium Risk
          </Badge>
        );
      default:
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Low Risk
          </Badge>
        );
    }
  };

  if (currentStep === "complete") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-success mb-2">
              Transaction Verified Successfully!
            </h1>
            <p className="text-success/80 mb-6">
              Your transaction has been approved and processed securely.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-success/20">
                <h3 className="font-semibold text-security-800">
                  Voice Verification
                </h3>
                <p className="text-sm text-security-600">
                  ✅ Passed ({voiceResult?.confidence.toFixed(1)}% confidence)
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-success/20">
                <h3 className="font-semibold text-security-800">
                  OTP Verification
                </h3>
                <p className="text-sm text-security-600">✅ Verified</p>
              </div>
            </div>
            <Button onClick={() => (window.location.href = "/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-danger/20 to-warning/20 rounded-2xl flex items-center justify-center">
          <Shield className="h-10 w-10 text-danger" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-security-900">
            Enhanced Security Verification Required
          </h1>
          <p className="text-xl text-security-600 max-w-3xl mx-auto">
            This transaction requires additional verification due to high risk
            factors
          </p>
        </div>
      </div>

      {/* Transaction Details */}
      <Card className="border-danger/20 bg-danger/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-danger">
            <AlertTriangle className="h-5 w-5" />
            <span>Flagged Transaction Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-security-600">Transaction ID:</span>
                <span className="font-mono text-security-800">
                  {transaction.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-security-600">Amount:</span>
                <span className="font-semibold text-security-800">
                  ${transaction.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-security-600">Risk Level:</span>
                {getRiskBadge(transaction.riskLevel)}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-security-600">Location:</span>
                <span className="text-security-800">
                  {transaction.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-security-600">Timestamp:</span>
                <span className="text-security-800">
                  {transaction.timestamp}
                </span>
              </div>
              <div>
                <span className="text-security-600">Risk Factors:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {transaction.riskFactors.map((factor, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-danger/20 text-danger"
                    >
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Voice Verification Section */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-security-600" />
              <span>Step 1: Voice Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Secret Phrase */}
            <div className="p-4 bg-security-50 rounded-lg border border-security-200">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-security-700">
                  Please say this phrase clearly:
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(
                      secretPhrase,
                    );
                    speechSynthesis.speak(utterance);
                  }}
                  className="text-security-600"
                >
                  <Volume2 className="h-4 w-4 mr-1" />
                  Listen
                </Button>
              </div>
              <p className="text-lg font-semibold text-security-900 text-center p-3 bg-white rounded border">
                "{secretPhrase}"
              </p>
            </div>

            {/* Recording Controls */}
            <div className="space-y-4">
              {isRecording && (
                <div className="text-center space-y-3">
                  <Badge className="bg-danger/10 text-danger border-danger/20 text-lg px-4 py-2">
                    <div className="w-3 h-3 bg-danger rounded-full mr-3 animate-pulse" />
                    Recording... {recordingTime}s / 30s
                  </Badge>
                  <Progress
                    value={(recordingTime / 30) * 100}
                    className="w-full h-3"
                  />
                  <div className="text-sm text-security-600">
                    {recordingTime < 3
                      ? "Keep speaking..."
                      : recordingTime < 10
                        ? "Good, continue..."
                        : "Almost done!"}
                  </div>
                </div>
              )}

              {/* Main Recording Button */}
              <div className="flex justify-center">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="w-24 h-24 rounded-full bg-danger hover:bg-danger/90 disabled:opacity-50"
                    disabled={isVerifyingVoice || currentStep !== "initial"}
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    className="w-24 h-24 rounded-full bg-security-600 hover:bg-security-700"
                  >
                    <Square className="h-8 w-8" />
                  </Button>
                )}
              </div>

              {/* Recording Actions */}
              {audioUrl && !isRecording && (
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={playRecording}
                    variant="outline"
                    disabled={isVerifyingVoice}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play Recording
                  </Button>
                  <Button
                    onClick={verifyVoice}
                    disabled={isVerifyingVoice}
                    className="bg-security-600 hover:bg-security-700"
                  >
                    {isVerifyingVoice ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying Voice...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Voice
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Voice Result */}
            {voiceResult && (
              <Alert
                className={`border ${
                  voiceResult.success
                    ? "border-success/20 bg-success/5"
                    : "border-danger/20 bg-danger/5"
                }`}
              >
                {voiceResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-danger" />
                )}
                <AlertDescription
                  className={
                    voiceResult.success ? "text-success" : "text-danger"
                  }
                >
                  <div className="space-y-2">
                    <div className="font-medium">{voiceResult.message}</div>
                    <div className="text-sm space-y-1">
                      <div>
                        Confidence: {voiceResult.confidence.toFixed(1)}%
                      </div>
                      <div>Emotional State: {voiceResult.emotionalState}</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* OTP Verification Section */}
        <Card
          className={`border-security-200 ${currentStep === "initial" ? "opacity-50" : ""}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-security-600" />
              <span>Step 2: OTP Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === "initial" && (
              <div className="text-center py-8 text-security-500">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete voice verification first</p>
              </div>
            )}

            {currentStep === "otp" && (
              <>
                {/* OTP Generation */}
                {!otpResult && (
                  <Button
                    onClick={generateOTP}
                    disabled={isGeneratingOTP}
                    className="w-full bg-security-600 hover:bg-security-700"
                  >
                    {isGeneratingOTP ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating OTP...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Generate OTP
                      </>
                    )}
                  </Button>
                )}

                {/* OTP Result */}
                {otpResult && (
                  <Alert
                    className={`border ${
                      otpResult.success
                        ? "border-success/20 bg-success/5"
                        : "border-danger/20 bg-danger/5"
                    }`}
                  >
                    {otpResult.success ? (
                      <Mail className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-danger" />
                    )}
                    <AlertDescription
                      className={
                        otpResult.success ? "text-success" : "text-danger"
                      }
                    >
                      {otpResult.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* OTP Timer */}
                {otpTimeLeft > 0 && (
                  <div className="text-center">
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      <Clock className="h-3 w-3 mr-1" />
                      OTP expires in {formatTime(otpTimeLeft)}
                    </Badge>
                  </div>
                )}

                {/* OTP Input */}
                {otpResult?.success && (
                  <div className="space-y-4">
                    <Label>Enter 6-Digit OTP</Label>
                    <div className="flex justify-center space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Input
                          key={index}
                          type="text"
                          value={otp[index] || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const newOtp = otp.split("");
                            newOtp[index] = value;
                            const updatedOtp = newOtp.join("").slice(0, 6);
                            setOtp(updatedOtp);

                            // Auto-focus next input
                            if (value && index < 5) {
                              const nextInput = document.querySelector(
                                `#otp-${index + 1}`,
                              ) as HTMLInputElement;
                              if (nextInput) nextInput.focus();
                            }
                          }}
                          id={`otp-${index}`}
                          className="w-12 h-12 text-center text-xl font-mono border-2 focus:border-security-600"
                          maxLength={1}
                          disabled={isVerifyingOTP}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={verifyOTP}
                      disabled={isVerifyingOTP || otp.length !== 6}
                      className="w-full bg-security-600 hover:bg-security-700"
                    >
                      {isVerifyingOTP ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying OTP...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Verify OTP
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} src={audioUrl} style={{ display: "none" }} />
    </div>
  );
}
