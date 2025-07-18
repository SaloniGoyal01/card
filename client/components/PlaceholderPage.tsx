import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  comingSoon?: boolean;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  features,
  comingSoon = true,
}: PlaceholderPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-8">
        {/* Icon and Title */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-security-100 to-security-200 rounded-2xl flex items-center justify-center">
            <Icon className="h-10 w-10 text-security-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-security-900">{title}</h1>
            <p className="text-xl text-security-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          {comingSoon && (
            <Badge className="bg-warning/10 text-warning border-warning/20">
              <Construction className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          )}
        </div>

        {/* Features Card */}
        <Card className="max-w-2xl mx-auto border-security-200">
          <CardHeader>
            <CardTitle className="text-security-800">
              Planned Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-security-50 border border-security-100"
                >
                  <div className="w-2 h-2 bg-security-500 rounded-full" />
                  <span className="text-security-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <p className="text-security-600">
            Want this feature implemented? Continue prompting to build it out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button className="bg-security-600 hover:bg-security-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-security-300 text-security-700 hover:bg-security-50"
            >
              Request Feature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
