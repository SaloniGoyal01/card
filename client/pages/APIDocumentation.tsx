import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Code,
  Mic,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Info,
  Play,
  Terminal,
  Shield,
} from "lucide-react";

export default function APIDocumentation() {
  const voiceEndpoints = [
    {
      method: "POST",
      endpoint: "/api/voice/verify",
      description: "Verify voice recording against user's voice profile",
      body: {
        audio: "File (audio recording)",
        userId: "string",
        transactionId: "string",
        expectedPhrase: "string",
      },
      response: {
        success: "boolean",
        confidence: "number (0-100)",
        message: "string",
        emotionalState: "string",
        verificationId: "string",
      },
    },
    {
      method: "GET",
      endpoint: "/api/voice/profile/:userId",
      description: "Get user's voice profile information",
      response: {
        exists: "boolean",
        registeredPhrase: "string",
        averageConfidence: "number",
        verificationHistory: "number",
      },
    },
  ];

  const otpEndpoints = [
    {
      method: "POST",
      endpoint: "/api/otp/generate",
      description: "Generate and send OTP to user",
      body: {
        userId: "string",
        transactionId: "string",
        phoneNumber: "string (optional)",
        email: "string (optional)",
      },
      response: {
        success: "boolean",
        message: "string",
        otpId: "string",
        expiresAt: "string (ISO date)",
      },
    },
    {
      method: "POST",
      endpoint: "/api/otp/verify",
      description: "Verify OTP code against generated one",
      body: {
        userId: "string",
        transactionId: "string",
        otp: "string (6 digits)",
      },
      response: {
        success: "boolean",
        message: "string",
      },
    },
    {
      method: "GET",
      endpoint: "/api/otp/status/:userId/:transactionId",
      description: "Get current OTP status for a transaction",
      response: {
        exists: "boolean",
        expired: "boolean",
        attempts: "number",
        maxAttempts: "number",
        timeRemaining: "number (seconds)",
      },
    },
  ];

  const testingInstructions = [
    {
      title: "Test Voice Verification",
      icon: Mic,
      steps: [
        "Click 'Full Test' button in dashboard",
        "Allow microphone permissions",
        "Click the red recording button",
        "Say: 'My voice is my password verify one two three'",
        "Stop recording and click 'Verify Voice'",
        "Check console for API logs",
        "API analyzes audio and returns confidence score",
      ],
      apiCall: `
fetch('/api/voice/verify', {
  method: 'POST',
  body: formData // contains audio file
});
      `,
    },
    {
      title: "Test OTP Generation & Verification",
      icon: Phone,
      steps: [
        "After successful voice verification, OTP auto-generates",
        "Or click 'Demo OTP' button in dashboard",
        "Check console logs for generated OTP",
        "Enter the 6-digit OTP in input fields",
        "System verifies against backend API",
        "Success/failure message displayed",
      ],
      apiCall: `
// Generate OTP
fetch('/api/otp/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_demo_123',
    transactionId: 'txn_123',
    phoneNumber: '+1-555-123-4567'
  })
});

// Verify OTP
fetch('/api/otp/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_demo_123',
    transactionId: 'txn_123',
    otp: '123456'
  })
});
      `,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-security-100 to-security-200 rounded-2xl flex items-center justify-center">
          <Code className="h-10 w-10 text-security-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-security-900">
            Voice & OTP API Documentation
          </h1>
          <p className="text-xl text-security-600 max-w-3xl mx-auto">
            Complete REST API documentation for voice verification and OTP
            systems
          </p>
        </div>
      </div>

      {/* Status */}
      <Alert className="border-success/20 bg-success/5">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <AlertDescription className="text-success">
          <strong>✅ All APIs are running and functional!</strong> Backend
          Express server with voice recording uploads, OTP
          generation/verification, and comprehensive error handling.
        </AlertDescription>
      </Alert>

      {/* Voice API Section */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-security-600" />
            <span>Voice Verification API</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {voiceEndpoints.map((endpoint, index) => (
            <div
              key={index}
              className="border border-security-100 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Badge className="bg-security-600 text-white">
                  {endpoint.method}
                </Badge>
                <code className="text-sm bg-security-50 px-2 py-1 rounded font-mono">
                  {endpoint.endpoint}
                </code>
              </div>
              <p className="text-security-700 mb-4">{endpoint.description}</p>

              {endpoint.body && (
                <div className="mb-4">
                  <h4 className="font-semibold text-security-800 mb-2">
                    Request Body:
                  </h4>
                  <pre className="bg-security-50 p-3 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(endpoint.body, null, 2)}</code>
                  </pre>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-security-800 mb-2">
                  Response:
                </h4>
                <pre className="bg-security-50 p-3 rounded text-sm overflow-x-auto">
                  <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                </pre>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* OTP API Section */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-security-600" />
            <span>OTP Verification API</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {otpEndpoints.map((endpoint, index) => (
            <div
              key={index}
              className="border border-security-100 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Badge
                  className={`${endpoint.method === "POST" ? "bg-success" : "bg-info"} text-white`}
                >
                  {endpoint.method}
                </Badge>
                <code className="text-sm bg-security-50 px-2 py-1 rounded font-mono">
                  {endpoint.endpoint}
                </code>
              </div>
              <p className="text-security-700 mb-4">{endpoint.description}</p>

              {endpoint.body && (
                <div className="mb-4">
                  <h4 className="font-semibold text-security-800 mb-2">
                    Request Body:
                  </h4>
                  <pre className="bg-security-50 p-3 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(endpoint.body, null, 2)}</code>
                  </pre>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-security-800 mb-2">
                  Response:
                </h4>
                <pre className="bg-security-50 p-3 rounded text-sm overflow-x-auto">
                  <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                </pre>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Testing Instructions */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-security-600" />
            <span>How to Test the APIs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {testingInstructions.map((instruction, index) => {
            const Icon = instruction.icon;
            return (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold text-security-800 flex items-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span>{instruction.title}</span>
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-security-700 mb-3">
                      Testing Steps:
                    </h4>
                    <ol className="space-y-2">
                      {instruction.steps.map((step, stepIndex) => (
                        <li
                          key={stepIndex}
                          className="flex items-start space-x-2"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-security-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {stepIndex + 1}
                          </span>
                          <span className="text-security-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-security-700 mb-3">
                      API Call Example:
                    </h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                      <code>{instruction.apiCall.trim()}</code>
                    </pre>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Server Logs */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-security-600" />
            <span>Backend Server Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-info/20 bg-info/5 mb-4">
            <Info className="h-4 w-4 text-info" />
            <AlertDescription className="text-info">
              <strong>Check your browser console and terminal</strong> to see
              API calls and responses. All OTP codes are logged to the console
              for demo purposes.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-security-800 mb-2">
                Expected Console Output:
              </h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm">
                {`🎤 Voice verification requested for user user_demo_123, transaction TXN_123
📝 Expected phrase: "My voice is my password verify one two three"
🔊 Audio file received: 45231 bytes, type: audio/webm
✅ Voice verification result: SUCCESS (87.3%)

🔢 OTP generated for user user_demo_123, transaction TXN_123: 123456
📱 SMS OTP sent to +1-555-123-4567: 123456
📱 [DEMO] Your verification code is: 123456

🔍 OTP verification attempt 1/3 for user user_demo_123
✅ OTP verified successfully for user user_demo_123`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Summary */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-security-600" />
            <span>Implemented Features Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-security-800 mb-3">
                Voice Verification Module:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    Real microphone access & recording
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    Audio upload to backend API
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    Voice biometric analysis simulation
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    Emotional state detection
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    Confidence scoring (0-100%)
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-security-800 mb-3">
                OTP Generation & Verification:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    6-digit OTP generation via API
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    SMS/Email simulation (console logs)
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    OTP verification with attempt limits
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    Expiration handling (5 minutes)
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-security-700">
                    Individual digit input boxes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
