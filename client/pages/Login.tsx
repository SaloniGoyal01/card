import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OTPVerification } from "@/components/OTPVerification";
import {
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    secretPhrase: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Validation
    const newErrors = [];
    if (!loginForm.email) newErrors.push("Email is required");
    if (!loginForm.password) newErrors.push("Password is required");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate login success - trigger OTP
    setCurrentUser(loginForm.email);
    setSuccess("Login credentials verified. OTP sent for 2FA.");
    setShowOtp(true);
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Validation
    const newErrors = [];
    if (!registerForm.firstName) newErrors.push("First name is required");
    if (!registerForm.lastName) newErrors.push("Last name is required");
    if (!registerForm.email) newErrors.push("Email is required");
    if (!registerForm.password) newErrors.push("Password is required");
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.push("Passwords do not match");
    }
    if (registerForm.password.length < 8) {
      newErrors.push("Password must be at least 8 characters");
    }
    if (!registerForm.phoneNumber) newErrors.push("Phone number is required");
    if (!registerForm.secretPhrase) newErrors.push("Secret phrase is required");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate registration success
    setCurrentUser(registerForm.email);
    setSuccess("Account created successfully! OTP sent for verification.");
    setShowOtp(true);
    setIsLoading(false);
  };

  const handleOtpComplete = (success: boolean) => {
    if (success) {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      setShowOtp(false);
      setErrors(["OTP verification failed. Please try again."]);
    }
  };

  if (showOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-security-50 via-white to-security-100 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center space-x-2">
              <Shield className="h-8 w-8 text-security-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-security-700 to-security-500 bg-clip-text text-transparent">
                FraudGuard AI
              </span>
            </Link>
          </div>
          <OTPVerification
            transactionId="AUTH_001"
            onVerificationComplete={handleOtpComplete}
            onCancel={() => setShowOtp(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-security-50 via-white to-security-100 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Shield className="h-8 w-8 text-security-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-security-700 to-security-500 bg-clip-text text-transparent">
              FraudGuard AI
            </span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-security-900">
              Secure Access
            </h1>
            <p className="text-security-600">
              Access your fraud detection dashboard
            </p>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="border-security-200 shadow-xl">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab}>
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-security-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="user@example.com"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-security-500" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-security-600 hover:bg-security-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm text-security-600 hover:text-security-800"
                  >
                    Forgot your password?
                  </a>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={registerForm.firstName}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={registerForm.lastName}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-security-500" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="user@example.com"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={registerForm.phoneNumber}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-security-500" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secretPhrase">
                      Secret Phrase (for voice verification)
                    </Label>
                    <Input
                      id="secretPhrase"
                      type="text"
                      placeholder="My voice is my password"
                      value={registerForm.secretPhrase}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          secretPhrase: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-security-600">
                      This phrase will be used for voice biometric verification
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-security-600 hover:bg-security-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Error Messages */}
            {errors.length > 0 && (
              <Alert className="border-danger/20 bg-danger/5 mt-4">
                <AlertTriangle className="h-4 w-4 text-danger" />
                <AlertDescription className="text-danger">
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert className="border-success/20 bg-success/5 mt-4">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  {success}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Demo Note */}
        <div className="text-center">
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Demo Mode - Use any credentials
          </Badge>
        </div>

        {/* Back to Landing */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-security-600 hover:text-security-800"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
