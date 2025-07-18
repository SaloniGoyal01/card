import { PlaceholderPage } from "@/components/PlaceholderPage";
import { User } from "lucide-react";

export default function Login() {
  return (
    <PlaceholderPage
      title="User Authentication"
      description="Secure login system with email, password, and OTP verification for enhanced security."
      icon={User}
      features={[
        "Email and password authentication",
        "Two-factor authentication (2FA)",
        "OTP verification via SMS/Email",
        "Social login integration",
        "Password reset and recovery",
        "Session management",
        "Account lockout protection",
        "Audit trail logging",
      ]}
    />
  );
}
