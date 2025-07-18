import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Mic,
  MicOff,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  RefreshCw,
  Shield,
} from "lucide-react";

interface VoiceRecorderProps {
  secretPhrase: string;
  onVerificationComplete: (success: boolean, confidence?: number) => void;
  onCancel?: () => void;
}

export function VoiceRecorder({
  secretPhrase,
  onVerificationComplete,
  onCancel,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    confidence: number;
    message: string;
    emotionalState?: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setVerificationResult(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            // Auto-stop after 30 seconds
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
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setAttempts((prev) => prev + 1);

    // Simulate AI voice analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate voice biometric matching and emotional analysis
    const biometricMatch = Math.random() > 0.3; // 70% success rate for demo
    const confidence = biometricMatch
      ? 75 + Math.random() * 20
      : 30 + Math.random() * 40;

    // Simulate emotional state detection
    const emotionalStates = ["calm", "stressed", "nervous", "confident"];
    const emotionalState =
      emotionalStates[Math.floor(Math.random() * emotionalStates.length)];

    // Determine if verification passes
    const passThreshold = 70;
    const isStressed =
      emotionalState === "stressed" || emotionalState === "nervous";
    const finalConfidence = isStressed ? confidence * 0.8 : confidence;
    const success = finalConfidence >= passThreshold && biometricMatch;

    let message = "";
    if (success) {
      message = `Voice verified successfully! Biometric match confirmed with ${finalConfidence.toFixed(1)}% confidence.`;
    } else if (!biometricMatch) {
      message = "Voice biometric doesn't match registered user profile.";
    } else if (isStressed) {
      message =
        "Emotional stress detected. This may indicate coercion. Security review required.";
    } else {
      message = `Voice verification failed. Confidence level too low (${finalConfidence.toFixed(1)}%).`;
    }

    setVerificationResult({
      success,
      confidence: finalConfidence,
      message,
      emotionalState,
    });

    setIsAnalyzing(false);

    // Auto-complete verification after showing result
    setTimeout(() => {
      onVerificationComplete(success, finalConfidence);
    }, 3000);
  };

  const reset = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl("");
    setRecordingTime(0);
    setVerificationResult(null);
    setIsPlaying(false);
  };

  const speakPhrase = () => {
    if ("speechSynthesis" in window) {
      setIsListening(true);
      const utterance = new SpeechSynthesisUtterance(
        `Please say your secret phrase: ${secretPhrase}`,
      );
      utterance.rate = 0.8;
      utterance.onend = () => setIsListening(false);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <Card className="border-security-200 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-security-100 to-security-200 rounded-full flex items-center justify-center">
            <Mic className="h-8 w-8 text-security-600" />
          </div>
          <div>
            <CardTitle className="text-2xl text-security-900">
              Voice Verification
            </CardTitle>
            <p className="text-security-600 mt-2">
              Please record your secret phrase for biometric verification
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Secret Phrase Display */}
          <div className="p-4 bg-security-50 rounded-lg border border-security-200">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-security-700">
                Secret Phrase:
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={speakPhrase}
                disabled={isListening}
                className="text-security-600 hover:text-security-800"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                {isListening ? "Speaking..." : "Listen"}
              </Button>
            </div>
            <p className="text-lg font-semibold text-security-900 text-center p-3 bg-white rounded border border-security-100">
              "{secretPhrase}"
            </p>
          </div>

          {/* Recording Controls */}
          <div className="space-y-4">
            {/* Recording Status */}
            {isRecording && (
              <div className="text-center space-y-2">
                <Badge className="bg-danger/10 text-danger border-danger/20">
                  <div className="w-2 h-2 bg-danger rounded-full mr-2 animate-pulse" />
                  Recording... {recordingTime}s
                </Badge>
                <Progress
                  value={(recordingTime / 30) * 100}
                  className="w-full"
                />
              </div>
            )}

            {/* Main Recording Button */}
            <div className="flex justify-center">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="w-24 h-24 rounded-full bg-security-600 hover:bg-security-700 shadow-lg"
                  disabled={isAnalyzing}
                >
                  <Mic className="h-8 w-8" />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  className="w-24 h-24 rounded-full bg-danger hover:bg-danger/90 shadow-lg"
                >
                  <Square className="h-8 w-8" />
                </Button>
              )}
            </div>

            {/* Playback Controls */}
            {audioUrl && !isRecording && (
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={playRecording}
                  disabled={isPlaying || isAnalyzing}
                  variant="outline"
                  className="border-security-300 text-security-700 hover:bg-security-50"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isPlaying ? "Playing..." : "Play Recording"}
                </Button>
                <Button
                  onClick={reset}
                  disabled={isAnalyzing}
                  variant="ghost"
                  className="text-security-600 hover:bg-security-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* Analysis Button */}
          {audioUrl && !verificationResult && (
            <Button
              onClick={analyzeVoice}
              disabled={isAnalyzing || isRecording}
              className="w-full bg-security-600 hover:bg-security-700"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Voice Pattern...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Voice
                </>
              )}
            </Button>
          )}

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
              <AlertDescription className="space-y-2">
                <div
                  className={
                    verificationResult.success ? "text-success" : "text-danger"
                  }
                >
                  {verificationResult.message}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-security-600">Confidence:</span>
                    <span className="font-medium">
                      {verificationResult.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-security-600">Emotional State:</span>
                    <Badge
                      variant="outline"
                      className={`${
                        verificationResult.emotionalState === "calm" ||
                        verificationResult.emotionalState === "confident"
                          ? "border-success/20 text-success"
                          : "border-warning/20 text-warning"
                      }`}
                    >
                      {verificationResult.emotionalState}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-security-600">Attempt:</span>
                    <span className="font-medium">{attempts}/3</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-security-600">
              Speak clearly and naturally in a quiet environment
            </p>
            <div className="flex justify-center space-x-4 text-xs text-security-500">
              <span>• Maximum 30 seconds</span>
              <span>• Minimum 3 seconds</span>
              <span>• Clear pronunciation</span>
            </div>
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isRecording || isAnalyzing}
              className="w-full border-security-300 text-security-700 hover:bg-security-50"
            >
              Cancel Verification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} src={audioUrl} style={{ display: "none" }} />
    </div>
  );
}
