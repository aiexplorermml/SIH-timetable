import { DashboardLayout } from "@/components/DashboardLayout";
import { useDepartment } from "@/hooks/useDepartment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const features = [
  "Dashboard with Department Analytics",
  "Student Management System", 
  "Faculty Management System",
  "Curriculum Management",
  "News & Events Management",
  "Advanced Search & Filtering",
  "Real-time Notifications",
  "Data Export & Reports"
];

export default function PrototypePage() {
  const { currentDepartment } = useDepartment();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentSection = location.pathname.split('/').pop() || 'dashboard';
  const sectionTitle = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Construction className="h-8 w-8 text-primary" />
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              Prototype
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {currentDepartment?.fullName || currentDepartment?.name} Department
            </h1>
            <h2 className="text-2xl font-semibold text-muted-foreground">
              {sectionTitle} Section
            </h2>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              This department will have all the same features as AI&ML department
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Features List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Planned Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Button */}
            <div className="text-center pt-4">
              <p className="text-muted-foreground mb-4">
                For a preview of functionality, check out the AI&ML department
              </p>
              <Button 
                onClick={() => navigate(`/department/aiml${currentSection !== 'dashboard' ? `/${currentSection}` : ''}`)}
                className="gap-2"
              >
                View AI&ML Reference
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Department Info */}
            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-primary">Department Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Code:</strong> {currentDepartment?.code}</p>
                  <p><strong>Full Name:</strong> {currentDepartment?.fullName}</p>
                  <p><strong>Status:</strong> <Badge variant="outline">Prototype</Badge></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}