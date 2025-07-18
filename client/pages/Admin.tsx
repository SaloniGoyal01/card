import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function Admin() {
  return (
    <PlaceholderPage
      title="Admin Monitoring Panel"
      description="Comprehensive administrative dashboard for managing flagged transactions and system oversight."
      icon={Users}
      features={[
        "Real-time transaction monitoring",
        "Fraud score analysis and trends",
        "User account management",
        "Card blocking/unblocking controls",
        "System configuration settings",
        "Alert and notification management",
        "Audit logs and reporting",
        "Machine learning model tuning",
      ]}
    />
  );
}
