import { PlaceholderPage } from "@/components/PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <PlaceholderPage
      title="Interactive Visualization Dashboard"
      description="Advanced analytics and visualizations for fraud detection insights and trends."
      icon={BarChart3}
      features={[
        "Real-time fraud trend analysis",
        "Interactive geographical maps",
        "Transaction speed pattern charts",
        "Risk score distribution graphs",
        "User behavior analytics",
        "Anomaly detection visualizations",
        "Custom dashboard widgets",
        "Export and reporting tools",
      ]}
    />
  );
}
