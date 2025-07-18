import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Smartphone,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  location: string;
  device: string;
  timestamp: string;
  fraudScore: number;
  status: "safe" | "flagged" | "blocked";
  anomalyReasons: string[];
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "txn_001",
      amount: 45.99,
      location: "New York, NY",
      device: "iPhone 15",
      timestamp: "2024-01-15 14:30:22",
      fraudScore: 0.12,
      status: "safe",
      anomalyReasons: [],
    },
    {
      id: "txn_002",
      amount: 1250.0,
      location: "Unknown Location",
      device: "Unknown Device",
      timestamp: "2024-01-15 14:35:18",
      fraudScore: 0.87,
      status: "flagged",
      anomalyReasons: ["Unusual amount", "Unknown location", "Device anomaly"],
    },
    {
      id: "txn_003",
      amount: 12.5,
      location: "San Francisco, CA",
      device: "MacBook Pro",
      timestamp: "2024-01-15 14:28:45",
      fraudScore: 0.05,
      status: "safe",
      anomalyReasons: [],
    },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    location: "",
    device: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<Transaction | null>(null);

  const simulateTransaction = async () => {
    if (
      !newTransaction.amount ||
      !newTransaction.location ||
      !newTransaction.device
    ) {
      return;
    }

    setIsProcessing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const amount = parseFloat(newTransaction.amount);

    // Simple fraud detection logic
    let fraudScore = 0;
    const anomalyReasons: string[] = [];

    // Amount-based rules
    if (amount > 1000) {
      fraudScore += 0.3;
      anomalyReasons.push("High amount transaction");
    }
    if (amount > 5000) {
      fraudScore += 0.4;
      anomalyReasons.push("Extremely high amount");
    }

    // Location-based rules
    if (newTransaction.location.toLowerCase().includes("unknown")) {
      fraudScore += 0.4;
      anomalyReasons.push("Unknown location");
    }

    // Device-based rules
    if (newTransaction.device.toLowerCase().includes("unknown")) {
      fraudScore += 0.3;
      anomalyReasons.push("Unrecognized device");
    }

    // Time-based anomaly (simplified)
    const lastTransactionTime = new Date(
      transactions[0]?.timestamp || Date.now(),
    );
    const currentTime = new Date();
    const timeDiff =
      (currentTime.getTime() - lastTransactionTime.getTime()) / 1000 / 60; // minutes

    if (timeDiff < 5) {
      fraudScore += 0.2;
      anomalyReasons.push("Rapid transaction sequence");
    }

    // Determine status
    let status: "safe" | "flagged" | "blocked" = "safe";
    if (fraudScore > 0.7) {
      status = "blocked";
    } else if (fraudScore > 0.4) {
      status = "flagged";
    }

    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      amount,
      location: newTransaction.location,
      device: newTransaction.device,
      timestamp: new Date().toISOString().replace("T", " ").split(".")[0],
      fraudScore,
      status,
      anomalyReasons,
    };

    setTransactions((prev) => [transaction, ...prev]);
    setLastResult(transaction);
    setNewTransaction({ amount: "", location: "", device: "" });
    setIsProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "flagged":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "blocked":
        return <Shield className="h-5 w-5 text-danger" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string, fraudScore: number) => {
    switch (status) {
      case "safe":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Safe ({(fraudScore * 100).toFixed(1)}%)
          </Badge>
        );
      case "flagged":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Flagged ({(fraudScore * 100).toFixed(1)}%)
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-danger/10 text-danger border-danger/20">
            Blocked ({(fraudScore * 100).toFixed(1)}%)
          </Badge>
        );
      default:
        return <Badge variant="secondary">Processing</Badge>;
    }
  };

  const stats = [
    {
      title: "Total Transactions",
      value: transactions.length.toString(),
      icon: DollarSign,
      color: "text-security-600",
    },
    {
      title: "Safe Transactions",
      value: transactions.filter((t) => t.status === "safe").length.toString(),
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      title: "Flagged",
      value: transactions
        .filter((t) => t.status === "flagged")
        .length.toString(),
      icon: AlertTriangle,
      color: "text-warning",
    },
    {
      title: "Blocked",
      value: transactions
        .filter((t) => t.status === "blocked")
        .length.toString(),
      icon: Shield,
      color: "text-danger",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-security-900">
            Fraud Detection Dashboard
          </h1>
          <p className="text-security-600 mt-1">
            Monitor and simulate credit card transactions in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-success">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>System Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-security-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-security-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-security-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Transaction Simulator */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-security-600" />
              <span>Transaction Simulator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Transaction Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="150.00"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={newTransaction.location}
                  onValueChange={(value) =>
                    setNewTransaction((prev) => ({ ...prev, location: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New York, NY">New York, NY</SelectItem>
                    <SelectItem value="Los Angeles, CA">
                      Los Angeles, CA
                    </SelectItem>
                    <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                    <SelectItem value="Miami, FL">Miami, FL</SelectItem>
                    <SelectItem value="Unknown Location">
                      Unknown Location
                    </SelectItem>
                    <SelectItem value="International">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="device">Device Type</Label>
                <Select
                  value={newTransaction.device}
                  onValueChange={(value) =>
                    setNewTransaction((prev) => ({ ...prev, device: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iPhone 15">iPhone 15</SelectItem>
                    <SelectItem value="Samsung Galaxy">
                      Samsung Galaxy
                    </SelectItem>
                    <SelectItem value="MacBook Pro">MacBook Pro</SelectItem>
                    <SelectItem value="Windows PC">Windows PC</SelectItem>
                    <SelectItem value="Unknown Device">
                      Unknown Device
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={simulateTransaction}
              disabled={
                isProcessing ||
                !newTransaction.amount ||
                !newTransaction.location ||
                !newTransaction.device
              }
              className="w-full bg-security-600 hover:bg-security-700"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Check Transaction
                </>
              )}
            </Button>

            {lastResult && (
              <Alert
                className={`border ${
                  lastResult.status === "safe"
                    ? "border-success/20 bg-success/5"
                    : lastResult.status === "flagged"
                      ? "border-warning/20 bg-warning/5"
                      : "border-danger/20 bg-danger/5"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Latest Transaction Result
                      </span>
                      {getStatusBadge(lastResult.status, lastResult.fraudScore)}
                    </div>
                    {lastResult.anomalyReasons.length > 0 && (
                      <div className="text-sm">
                        <strong>Anomaly Reasons:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {lastResult.anomalyReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Real-time Monitoring */}
        <Card className="border-security-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-security-600" />
              <span>Real-time Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-security-50 border border-security-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <div>
                    <div className="font-medium text-security-800">
                      System Status
                    </div>
                    <div className="text-sm text-security-600">
                      All monitors active
                    </div>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  Online
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-security-600">AI Model Accuracy</span>
                  <span className="font-medium text-security-800">99.2%</span>
                </div>
                <div className="w-full bg-security-100 rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: "99.2%" }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-security-600">Response Time</span>
                  <span className="font-medium text-security-800">45ms</span>
                </div>
                <div className="w-full bg-security-100 rounded-full h-2">
                  <div
                    className="bg-security-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-security-600">Daily Transactions</span>
                  <span className="font-medium text-security-800">2,847</span>
                </div>
                <div className="w-full bg-security-100 rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{ width: "67%" }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="border-security-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-security-600" />
            <span>Transaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-security-100 hover:bg-security-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-security-800">
                        ${transaction.amount.toFixed(2)}
                      </span>
                      {getStatusBadge(
                        transaction.status,
                        transaction.fraudScore,
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-security-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{transaction.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Smartphone className="h-3 w-3" />
                        <span>{transaction.device}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{transaction.timestamp}</span>
                      </span>
                    </div>
                    {transaction.anomalyReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {transaction.anomalyReasons.map((reason, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-warning/20 text-warning"
                          >
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-security-700">
                    Risk Score
                  </div>
                  <div className="text-lg font-bold text-security-900">
                    {(transaction.fraudScore * 100).toFixed(1)}%
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
