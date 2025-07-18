import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Activity,
  Timer,
  Gauge,
  RefreshCw,
} from "lucide-react";

interface TransactionSpeed {
  timestamp: string;
  timeBetween: number; // seconds
  amount: number;
  location: string;
  isAnomaly: boolean;
  zScore: number;
  riskLevel: "low" | "medium" | "high";
}

interface SpeedProfile {
  avgTimeBetween: number;
  stdDeviation: number;
  totalTransactions: number;
  anomalyCount: number;
  maxSpeed: number;
  minSpeed: number;
}

export default function Anomaly() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speedProfile, setSpeedProfile] = useState<SpeedProfile>({
    avgTimeBetween: 1245, // 20 minutes average
    stdDeviation: 567,
    totalTransactions: 127,
    anomalyCount: 8,
    maxSpeed: 15, // 15 seconds fastest
    minSpeed: 7200, // 2 hours slowest
  });

  const [recentSpeeds, setRecentSpeeds] = useState<TransactionSpeed[]>([
    {
      timestamp: "2024-01-15 14:35:18",
      timeBetween: 25,
      amount: 1250.0,
      location: "Unknown Location",
      isAnomaly: true,
      zScore: 3.2,
      riskLevel: "high",
    },
    {
      timestamp: "2024-01-15 14:34:53",
      timeBetween: 1890,
      amount: 45.99,
      location: "New York, NY",
      isAnomaly: false,
      zScore: 0.8,
      riskLevel: "low",
    },
    {
      timestamp: "2024-01-15 14:03:23",
      timeBetween: 3420,
      amount: 12.5,
      location: "San Francisco, CA",
      isAnomaly: false,
      zScore: 1.1,
      riskLevel: "low",
    },
    {
      timestamp: "2024-01-15 13:06:03",
      timeBetween: 45,
      amount: 899.0,
      location: "Los Angeles, CA",
      isAnomaly: true,
      zScore: 2.8,
      riskLevel: "high",
    },
    {
      timestamp: "2024-01-15 13:05:18",
      timeBetween: 2250,
      amount: 67.89,
      location: "Chicago, IL",
      isAnomaly: false,
      zScore: 0.3,
      riskLevel: "low",
    },
  ]);

  const [realTimeStats, setRealTimeStats] = useState({
    currentVelocity: 2.3, // transactions per hour
    velocityTrend: "increasing",
    lastTransactionGap: 847, // seconds
    suspiciousPatterns: 3,
  });

  const analyzeTransactionSpeed = async () => {
    setIsAnalyzing(true);

    // Simulate real-time analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update stats with new simulated data
    setRealTimeStats((prev) => ({
      ...prev,
      currentVelocity: 1.8 + Math.random() * 2,
      lastTransactionGap: Math.floor(300 + Math.random() * 2000),
      suspiciousPatterns: Math.floor(Math.random() * 5),
    }));

    setIsAnalyzing(false);
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      default:
        return "text-success";
    }
  };

  const getRiskBadge = (riskLevel: string, zScore: number) => {
    const baseClasses = "font-medium";
    switch (riskLevel) {
      case "high":
        return (
          <Badge
            className={`${baseClasses} bg-danger/10 text-danger border-danger/20`}
          >
            High Risk (Z: {zScore.toFixed(1)})
          </Badge>
        );
      case "medium":
        return (
          <Badge
            className={`${baseClasses} bg-warning/10 text-warning border-warning/20`}
          >
            Medium Risk (Z: {zScore.toFixed(1)})
          </Badge>
        );
      default:
        return (
          <Badge
            className={`${baseClasses} bg-success/10 text-success border-success/20`}
          >
            Low Risk (Z: {zScore.toFixed(1)})
          </Badge>
        );
    }
  };

  const anomalyRate =
    (speedProfile.anomalyCount / speedProfile.totalTransactions) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-security-900">
            Transaction Speed Anomaly Detection
          </h1>
          <p className="text-security-600 mt-1">
            Real-time analysis of transaction timing patterns and behavioral
            anomalies
          </p>
        </div>
        <Button
          onClick={analyzeTransactionSpeed}
          disabled={isAnalyzing}
          className="bg-security-600 hover:bg-security-700"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Activity className="mr-2 h-4 w-4" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      {/* Real-time Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Current Velocity
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {realTimeStats.currentVelocity.toFixed(1)}
                </p>
                <p className="text-xs text-security-500">transactions/hour</p>
              </div>
              <Gauge className="h-8 w-8 text-security-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Last Transaction Gap
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {formatTime(realTimeStats.lastTransactionGap)}
                </p>
                <p className="text-xs text-security-500">time elapsed</p>
              </div>
              <Timer className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Anomaly Rate
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {anomalyRate.toFixed(1)}%
                </p>
                <p className="text-xs text-security-500">
                  {speedProfile.anomalyCount} of{" "}
                  {speedProfile.totalTransactions}
                </p>
              </div>
              <TrendingUp
                className={`h-8 w-8 ${anomalyRate > 10 ? "text-danger" : "text-warning"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Suspicious Patterns
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {realTimeStats.suspiciousPatterns}
                </p>
                <p className="text-xs text-security-500">detected today</p>
              </div>
              <AlertTriangle
                className={`h-8 w-8 ${realTimeStats.suspiciousPatterns > 2 ? "text-danger" : "text-warning"}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Speed Profile Analysis */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-security-600" />
              <span>User Speed Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-security-600">
                  Average Time Between Transactions
                </span>
                <span className="font-semibold text-security-900">
                  {formatTime(speedProfile.avgTimeBetween)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-security-600">
                  Standard Deviation
                </span>
                <span className="font-semibold text-security-900">
                  {formatTime(speedProfile.stdDeviation)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-security-600">
                  Fastest Transaction
                </span>
                <span className="font-semibold text-danger">
                  {formatTime(speedProfile.maxSpeed)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-security-600">
                  Slowest Transaction
                </span>
                <span className="font-semibold text-success">
                  {formatTime(speedProfile.minSpeed)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-security-600">Speed Consistency</span>
                <span className="font-medium text-security-800">
                  {(
                    (1 -
                      speedProfile.stdDeviation / speedProfile.avgTimeBetween) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <Progress
                value={
                  (1 -
                    speedProfile.stdDeviation / speedProfile.avgTimeBetween) *
                  100
                }
                className="w-full"
              />
            </div>

            <Alert className="border-security-200 bg-security-50">
              <Activity className="h-4 w-4 text-security-600" />
              <AlertDescription className="text-security-700">
                <strong>Behavioral Pattern:</strong> User typically spaces
                transactions {formatTime(speedProfile.avgTimeBetween)} apart.
                Transactions faster than{" "}
                {formatTime(
                  speedProfile.avgTimeBetween - 2 * speedProfile.stdDeviation,
                )}{" "}
                are flagged as anomalies.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Real-time Detection Algorithm */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-security-600" />
              <span>Detection Algorithm</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-security-50 rounded-lg border border-security-200">
                <h4 className="font-semibold text-security-800 mb-2">
                  Z-Score Analysis
                </h4>
                <p className="text-sm text-security-600 mb-3">
                  Measures how many standard deviations a transaction speed
                  differs from the user's normal pattern.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Z-Score &lt; 2.0</span>
                    <Badge className="bg-success/10 text-success border-success/20">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Z-Score 2.0-3.0</span>
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      Suspicious
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Z-Score &gt; 3.0</span>
                    <Badge className="bg-danger/10 text-danger border-danger/20">
                      Anomaly
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-security-50 rounded-lg border border-security-200">
                <h4 className="font-semibold text-security-800 mb-2">
                  Pattern Recognition
                </h4>
                <div className="space-y-2 text-sm text-security-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Rapid succession detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Time-of-day analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Velocity clustering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Behavioral deviation scoring</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <h4 className="font-semibold text-warning mb-2">
                  Active Alerts
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-security-600">
                      Rapid transactions in last hour:
                    </span>
                    <span className="font-medium text-warning">2 detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-security-600">
                      Unusual velocity patterns:
                    </span>
                    <span className="font-medium text-warning">1 pattern</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transaction Speed Analysis */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-security-600" />
            <span>Recent Transaction Speed Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSpeeds.map((speed, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-security-100 hover:bg-security-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {speed.isAnomaly ? (
                    <AlertTriangle className="h-5 w-5 text-danger" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-security-800">
                        ${speed.amount.toFixed(2)}
                      </span>
                      {getRiskBadge(speed.riskLevel, speed.zScore)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-security-600 mt-1">
                      <span>{speed.location}</span>
                      <span>{speed.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-security-900">
                    {formatTime(speed.timeBetween)}
                  </div>
                  <div className="text-sm text-security-600">
                    since last transaction
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
