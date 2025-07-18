import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  Brain,
  Mic,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Users,
  BarChart3,
  Lock,
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Detection",
      description: "Instant fraud analysis with millisecond response times",
      color: "text-warning",
    },
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning models that learn and adapt",
      color: "text-security-600",
    },
    {
      icon: Mic,
      title: "Voice Verification",
      description: "Biometric voice authentication with emotional AI",
      color: "text-success",
    },
    {
      icon: Globe,
      title: "Global Monitoring",
      description: "Worldwide transaction tracking and location analysis",
      color: "text-security-500",
    },
    {
      icon: TrendingUp,
      title: "Anomaly Detection",
      description: "Statistical analysis of spending patterns and behaviors",
      color: "text-danger",
    },
    {
      icon: Lock,
      title: "Multi-Layer Security",
      description: "OTP, voice, and behavioral verification layers",
      color: "text-security-700",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Accuracy Rate" },
    { value: "<50ms", label: "Response Time" },
    { value: "24/7", label: "Monitoring" },
    { value: "0.01%", label: "False Positives" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-security-50 via-white to-security-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,76,231,0.05)_50%,transparent_75%)] bg-[length:20px_20px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  AI-Powered Security
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-security-800 via-security-600 to-security-500 bg-clip-text text-transparent">
                    Stop Fraud
                  </span>
                  <br />
                  <span className="text-security-900">Before It Starts</span>
                </h1>
                <p className="text-xl text-security-700 max-w-lg leading-relaxed">
                  Advanced real-time credit card fraud detection with AI-powered
                  analytics, voice verification, and behavioral monitoring.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-security-600 to-security-500 hover:from-security-700 hover:to-security-600 text-white shadow-lg shadow-security-600/25 group"
                  >
                    Start Detection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-security-300 text-security-700 hover:bg-security-50"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-security-800">
                      {stat.value}
                    </div>
                    <div className="text-sm text-security-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-security-600/10 border border-security-200 p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-security-800">
                      Live Transaction Monitor
                    </h3>
                    <Badge className="bg-success/10 text-success border-success/20">
                      <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                      Active
                    </Badge>
                  </div>

                  {/* Mock Transaction */}
                  <div className="space-y-4">
                    {[
                      {
                        status: "safe",
                        amount: "$45.99",
                        location: "Local Store",
                      },
                      {
                        status: "warning",
                        amount: "$1,200.00",
                        location: "Unknown Location",
                      },
                      {
                        status: "safe",
                        amount: "$12.50",
                        location: "Coffee Shop",
                      },
                    ].map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-security-100 bg-security-50/50"
                      >
                        <div className="flex items-center space-x-3">
                          {transaction.status === "safe" ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-warning" />
                          )}
                          <div>
                            <div className="font-medium text-security-800">
                              {transaction.amount}
                            </div>
                            <div className="text-sm text-security-600">
                              {transaction.location}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            transaction.status === "safe"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            transaction.status === "safe"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {transaction.status === "safe"
                            ? "Verified"
                            : "Review"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Decorations */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-security-500 to-security-600 rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-success to-success/50 rounded-full opacity-20 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-security-100 text-security-700 border-security-200">
              <Shield className="h-3 w-3 mr-1" />
              Advanced Protection
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-security-900">
              Comprehensive Fraud Prevention
            </h2>
            <p className="text-xl text-security-600 max-w-3xl mx-auto">
              Multi-layered security system combining AI, behavioral analysis,
              and real-time monitoring to protect against sophisticated fraud
              attempts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl hover:shadow-security-600/10 transition-all duration-300 border-security-100 hover:border-security-200"
                >
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-security-100 to-security-200 flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-security-800">
                        {feature.title}
                      </h3>
                      <p className="text-security-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-security-800 via-security-700 to-security-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:32px_32px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Protect Your Transactions?
            </h2>
            <p className="text-xl text-security-100 max-w-2xl mx-auto">
              Join thousands of businesses using FraudGuard AI to prevent fraud
              and protect their customers in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-security-700 hover:bg-security-50 shadow-lg group"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Users className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
