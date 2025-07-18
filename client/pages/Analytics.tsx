import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  MapPin,
  Clock,
  Users,
  Shield,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";

// Mock data for charts
const fraudTrendData = [
  { time: "00:00", fraud: 12, normal: 145 },
  { time: "04:00", fraud: 8, normal: 89 },
  { time: "08:00", fraud: 23, normal: 234 },
  { time: "12:00", fraud: 31, normal: 312 },
  { time: "16:00", fraud: 28, normal: 278 },
  { time: "20:00", fraud: 19, normal: 198 },
];

const locationData = [
  { location: "New York, NY", transactions: 1245, fraudRate: 2.3 },
  { location: "Los Angeles, CA", transactions: 987, fraudRate: 1.8 },
  { location: "Chicago, IL", transactions: 756, fraudRate: 3.1 },
  { location: "Miami, FL", transactions: 654, fraudRate: 4.2 },
  { location: "International", transactions: 432, fraudRate: 8.7 },
  { location: "Unknown", transactions: 123, fraudRate: 15.3 },
];

const riskDistribution = [
  { range: "0-20%", count: 2847, percentage: 78.2 },
  { range: "21-40%", count: 542, percentage: 14.9 },
  { range: "41-60%", count: 187, percentage: 5.1 },
  { range: "61-80%", count: 45, percentage: 1.2 },
  { range: "81-100%", count: 21, percentage: 0.6 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const exportData = () => {
    // Simulate data export
    const data = {
      fraudTrends: fraudTrendData,
      locationAnalysis: locationData,
      riskDistribution: riskDistribution,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fraud-analytics-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalTransactions = fraudTrendData.reduce(
    (sum, item) => sum + item.fraud + item.normal,
    0,
  );
  const totalFraud = fraudTrendData.reduce((sum, item) => sum + item.fraud, 0);
  const fraudRate = ((totalFraud / totalTransactions) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-security-900">
            Interactive Analytics Dashboard
          </h1>
          <p className="text-security-600 mt-1">
            Advanced visualizations and insights for fraud detection trends
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            variant="outline"
            className="border-security-300 text-security-700 hover:bg-security-50"
          >
            {isRefreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            onClick={exportData}
            className="bg-security-600 hover:bg-security-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Overall Fraud Rate
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {fraudRate}%
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <TrendingDown className="h-3 w-3 text-success" />
                  <span className="text-success">-0.3% from yesterday</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-security-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Transactions Analyzed
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {totalTransactions.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-success">+12% from yesterday</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Blocked Transactions
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {totalFraud}
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <TrendingDown className="h-3 w-3 text-success" />
                  <span className="text-success">-8% from yesterday</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-danger" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-security-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-security-600">
                  Active Locations
                </p>
                <p className="text-2xl font-bold text-security-900">
                  {locationData.length}
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <Globe className="h-3 w-3 text-security-600" />
                  <span className="text-security-600">Worldwide coverage</span>
                </div>
              </div>
              <MapPin className="h-8 w-8 text-security-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Fraud Trends Chart */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-security-600" />
              <span>Fraud Detection Trends (24h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {fraudTrendData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-security-600">{item.time}</span>
                    <div className="space-x-4">
                      <span className="text-success">
                        Normal: {item.normal}
                      </span>
                      <span className="text-danger">Fraud: {item.fraud}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(item.normal / (item.normal + item.fraud)) * 100}
                      className="h-3"
                    />
                    <div
                      className="absolute top-0 right-0 h-3 bg-danger rounded-r"
                      style={{
                        width: `${(item.fraud / (item.normal + item.fraud)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Analysis */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-security-600" />
              <span>Geographic Fraud Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationData.map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-security-600" />
                      <span className="font-medium text-security-800">
                        {location.location}
                      </span>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${
                          location.fraudRate > 10
                            ? "bg-danger/10 text-danger border-danger/20"
                            : location.fraudRate > 5
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                        }`}
                      >
                        {location.fraudRate}% fraud rate
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-security-600">
                    <span>
                      {location.transactions.toLocaleString()} transactions
                    </span>
                    <span>
                      {Math.round(
                        (location.transactions * location.fraudRate) / 100,
                      )}{" "}
                      flagged
                    </span>
                  </div>
                  <Progress
                    value={location.fraudRate}
                    className={`h-2 ${
                      location.fraudRate > 10
                        ? "text-danger"
                        : location.fraudRate > 5
                          ? "text-warning"
                          : "text-success"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Risk Score Distribution */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-security-600" />
              <span>Risk Score Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskDistribution.map((range, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-security-800">
                      {range.range}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-security-900">
                        {range.count.toLocaleString()}
                      </div>
                      <div className="text-xs text-security-600">
                        {range.percentage}%
                      </div>
                    </div>
                  </div>
                  <Progress value={range.percentage} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Performance Metrics */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-security-600" />
              <span>System Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-security-600">Detection Accuracy</span>
                <span className="font-medium text-security-800">99.2%</span>
              </div>
              <Progress value={99.2} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-security-600">Average Response Time</span>
                <span className="font-medium text-security-800">45ms</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-security-600">False Positive Rate</span>
                <span className="font-medium text-security-800">0.8%</span>
              </div>
              <Progress value={0.8} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-security-600">System Uptime</span>
                <span className="font-medium text-security-800">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>

            <div className="pt-4 border-t border-security-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success">2.3s</div>
                  <div className="text-xs text-security-600">
                    Avg Processing
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-security-900">
                    24/7
                  </div>
                  <div className="text-xs text-security-600">Monitoring</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-security-600" />
            <span>Real-time Activity Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                time: "14:35:22",
                event: "High-risk transaction blocked",
                location: "International",
                type: "blocked",
              },
              {
                time: "14:34:18",
                event: "Voice verification completed",
                location: "New York, NY",
                type: "verified",
              },
              {
                time: "14:33:45",
                event: "OTP verification successful",
                location: "Chicago, IL",
                type: "verified",
              },
              {
                time: "14:32:12",
                event: "Anomaly detected - rapid succession",
                location: "Los Angeles, CA",
                type: "flagged",
              },
              {
                time: "14:31:58",
                event: "Normal transaction processed",
                location: "Miami, FL",
                type: "normal",
              },
              {
                time: "14:30:43",
                event: "User account temporarily suspended",
                location: "Unknown",
                type: "blocked",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-security-50 border border-security-100"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "blocked"
                        ? "bg-danger"
                        : activity.type === "flagged"
                          ? "bg-warning"
                          : activity.type === "verified"
                            ? "bg-success"
                            : "bg-security-400"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-security-800">
                      {activity.event}
                    </div>
                    <div className="text-sm text-security-600">
                      {activity.location}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-security-600">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
