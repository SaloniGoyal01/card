import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  BarChart3,
  Settings,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Ban,
  Eye,
  Search,
} from "lucide-react";

interface FlaggedTransaction {
  id: string;
  userId: string;
  amount: number;
  location: string;
  timestamp: string;
  fraudScore: number;
  status: "pending" | "approved" | "blocked";
  riskFactors: string[];
  userEmail: string;
}

interface UserAccount {
  id: string;
  email: string;
  name: string;
  status: "active" | "blocked" | "suspended";
  cardNumber: string;
  lastTransaction: string;
  riskScore: number;
  flaggedTransactions: number;
}

export default function Admin() {
  const [flaggedTransactions, setFlaggedTransactions] = useState<
    FlaggedTransaction[]
  >([
    {
      id: "TXN_001",
      userId: "USR_123",
      amount: 2450.0,
      location: "Unknown Location",
      timestamp: "2024-01-15 14:35:18",
      fraudScore: 0.87,
      status: "pending",
      riskFactors: ["High amount", "Unknown location", "Rapid succession"],
      userEmail: "john.doe@example.com",
    },
    {
      id: "TXN_002",
      userId: "USR_456",
      amount: 1250.0,
      location: "International",
      timestamp: "2024-01-15 13:22:45",
      fraudScore: 0.75,
      status: "pending",
      riskFactors: ["International transaction", "Unusual time"],
      userEmail: "jane.smith@example.com",
    },
    {
      id: "TXN_003",
      userId: "USR_789",
      amount: 899.0,
      location: "Los Angeles, CA",
      timestamp: "2024-01-15 12:15:30",
      fraudScore: 0.65,
      status: "approved",
      riskFactors: ["High amount"],
      userEmail: "mike.wilson@example.com",
    },
  ]);

  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: "USR_123",
      email: "john.doe@example.com",
      name: "John Doe",
      status: "active",
      cardNumber: "**** **** **** 1234",
      lastTransaction: "2024-01-15 14:35:18",
      riskScore: 0.87,
      flaggedTransactions: 3,
    },
    {
      id: "USR_456",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      status: "active",
      cardNumber: "**** **** **** 5678",
      lastTransaction: "2024-01-15 13:22:45",
      riskScore: 0.45,
      flaggedTransactions: 1,
    },
    {
      id: "USR_789",
      email: "mike.wilson@example.com",
      name: "Mike Wilson",
      status: "blocked",
      cardNumber: "**** **** **** 9012",
      lastTransaction: "2024-01-15 12:15:30",
      riskScore: 0.92,
      flaggedTransactions: 5,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleTransactionAction = (
    transactionId: string,
    action: "approve" | "block",
  ) => {
    setFlaggedTransactions((prev) =>
      prev.map((txn) =>
        txn.id === transactionId
          ? { ...txn, status: action === "approve" ? "approved" : "blocked" }
          : txn,
      ),
    );
  };

  const handleUserAction = (
    userId: string,
    action: "block" | "unblock" | "suspend",
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                action === "block"
                  ? "blocked"
                  : action === "unblock"
                    ? "active"
                    : "suspended",
            }
          : user,
      ),
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Approved
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-danger/10 text-danger border-danger/20">
            Blocked
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    {
      title: "Pending Reviews",
      value: flaggedTransactions
        .filter((t) => t.status === "pending")
        .length.toString(),
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Blocked Today",
      value: flaggedTransactions
        .filter((t) => t.status === "blocked")
        .length.toString(),
      icon: Ban,
      color: "text-danger",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      icon: Users,
      color: "text-success",
    },
    {
      title: "High Risk Users",
      value: users.filter((u) => u.riskScore > 0.7).length.toString(),
      icon: AlertTriangle,
      color: "text-danger",
    },
  ];

  const filteredTransactions = flaggedTransactions.filter((txn) => {
    const matchesSearch =
      txn.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || txn.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-security-900">
            Admin Control Panel
          </h1>
          <p className="text-security-600 mt-1">
            Monitor and manage fraud detection system operations
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-success">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>System Monitoring Active</span>
        </div>
      </div>

      {/* Stats Overview */}
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Flagged Transactions</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* Flagged Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-security-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Flagged Transactions</span>
              </CardTitle>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Transactions</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-security-500" />
                    <Input
                      id="search"
                      placeholder="Search by email or transaction ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="filter">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-security-200 rounded-lg p-4 hover:bg-security-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-security-600">
                            {transaction.id}
                          </span>
                          {getStatusBadge(transaction.status)}
                          <Badge className="bg-danger/10 text-danger border-danger/20">
                            Risk: {(transaction.fraudScore * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-security-600">User:</span>{" "}
                            <span className="font-medium">
                              {transaction.userEmail}
                            </span>
                          </div>
                          <div>
                            <span className="text-security-600">Amount:</span>{" "}
                            <span className="font-medium">
                              ${transaction.amount.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-security-600">Location:</span>{" "}
                            <span className="font-medium">
                              {transaction.location}
                            </span>
                          </div>
                          <div>
                            <span className="text-security-600">Time:</span>{" "}
                            <span className="font-medium">
                              {transaction.timestamp}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {transaction.riskFactors.map((factor, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-warning/20 text-warning"
                            >
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {transaction.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() =>
                              handleTransactionAction(transaction.id, "approve")
                            }
                            size="sm"
                            className="bg-success hover:bg-success/90"
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() =>
                              handleTransactionAction(transaction.id, "block")
                            }
                            size="sm"
                            variant="destructive"
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            Block
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-security-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-security-600" />
                <span>User Account Management</span>
              </CardTitle>
              <div>
                <Label htmlFor="user-search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-security-500" />
                  <Input
                    id="user-search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border border-security-200 rounded-lg p-4 hover:bg-security-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-security-800">
                            {user.name}
                          </span>
                          {getStatusBadge(user.status)}
                          {user.riskScore > 0.7 && (
                            <Badge className="bg-danger/10 text-danger border-danger/20">
                              High Risk
                            </Badge>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-security-600">Email:</span>{" "}
                            <span className="font-medium">{user.email}</span>
                          </div>
                          <div>
                            <span className="text-security-600">Card:</span>{" "}
                            <span className="font-mono">{user.cardNumber}</span>
                          </div>
                          <div>
                            <span className="text-security-600">
                              Risk Score:
                            </span>{" "}
                            <span className="font-medium">
                              {(user.riskScore * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-security-600">
                              Last Transaction:
                            </span>{" "}
                            <span className="font-medium">
                              {user.lastTransaction}
                            </span>
                          </div>
                          <div>
                            <span className="text-security-600">
                              Flagged Transactions:
                            </span>{" "}
                            <span className="font-medium">
                              {user.flaggedTransactions}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                        {user.status === "active" ? (
                          <>
                            <Button
                              onClick={() =>
                                handleUserAction(user.id, "suspend")
                              }
                              size="sm"
                              variant="outline"
                              className="border-warning text-warning hover:bg-warning/10"
                            >
                              <Lock className="mr-1 h-4 w-4" />
                              Suspend
                            </Button>
                            <Button
                              onClick={() => handleUserAction(user.id, "block")}
                              size="sm"
                              variant="destructive"
                            >
                              <Ban className="mr-1 h-4 w-4" />
                              Block
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleUserAction(user.id, "unblock")}
                            size="sm"
                            className="bg-success hover:bg-success/90"
                          >
                            <Unlock className="mr-1 h-4 w-4" />
                            Unblock
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-security-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-security-600" />
                  <span>Fraud Detection Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Risk Threshold</Label>
                  <Select defaultValue="70">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60% - Low Sensitivity</SelectItem>
                      <SelectItem value="70">
                        70% - Medium Sensitivity
                      </SelectItem>
                      <SelectItem value="80">80% - High Sensitivity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Auto-Block Threshold</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="85">85% - Aggressive</SelectItem>
                      <SelectItem value="90">90% - Balanced</SelectItem>
                      <SelectItem value="95">95% - Conservative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Voice Verification Required</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="high">High Risk Only</SelectItem>
                      <SelectItem value="never">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-security-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-security-600" />
                  <span>System Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-security-600">Model Accuracy</span>
                    <span className="font-medium text-security-800">99.2%</span>
                  </div>
                  <div className="w-full bg-security-100 rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{ width: "99.2%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-security-600">Response Time</span>
                    <span className="font-medium text-security-800">
                      45ms avg
                    </span>
                  </div>
                  <div className="w-full bg-security-100 rounded-full h-2">
                    <div
                      className="bg-security-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-security-600">System Load</span>
                    <span className="font-medium text-security-800">23%</span>
                  </div>
                  <div className="w-full bg-security-100 rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full"
                      style={{ width: "23%" }}
                    />
                  </div>
                </div>
                <Alert className="border-success/20 bg-success/5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    All systems operational. No issues detected.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
