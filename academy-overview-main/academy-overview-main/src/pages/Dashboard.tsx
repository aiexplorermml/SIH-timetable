import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StudentDistributionChart } from "@/components/StudentDistributionChart";
import { FacultyQualificationChart } from "@/components/FacultyQualificationChart";
import { NewsEventsSection } from "@/components/NewsEventsSection";
import { QuickActions } from "@/components/QuickActions";
import { RecentActivity } from "@/components/RecentActivity";
import { Users, GraduationCap, UserCheck, Calendar, TrendingUp, Award } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome to the College Admin Portal. Here's your institutional overview.
          </p>
        </div>

        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value="1,715"
            subtitle="Active enrollments"
            icon={Users}
            trend={{ value: 8.2, isPositive: true }}
            className="animate-fade-in"
          />
          <StatCard
            title="Alumni Network"
            value="8,420"
            subtitle="Graduated students"
            icon={UserCheck}
            trend={{ value: 15.3, isPositive: true }}
            className="animate-fade-in [animation-delay:100ms]"
          />
          <StatCard
            title="Faculty Members"
            value="120"
            subtitle="Teaching staff"
            icon={GraduationCap}
            trend={{ value: 3.1, isPositive: true }}
            className="animate-fade-in [animation-delay:200ms]"
          />
          <StatCard
            title="Success Rate"
            value="94.8%"
            subtitle="Graduation rate"
            icon={Award}
            trend={{ value: 2.4, isPositive: true }}
            className="animate-fade-in [animation-delay:300ms]"
          />
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up [animation-delay:400ms]">
          <QuickActions />
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="animate-scale-in [animation-delay:500ms]">
                <StudentDistributionChart />
              </div>
              <div className="animate-scale-in [animation-delay:600ms]">
                <FacultyQualificationChart />
              </div>
            </div>
            
            <div className="animate-fade-in [animation-delay:700ms]">
              <NewsEventsSection />
            </div>
          </div>
          
          <div className="animate-slide-up [animation-delay:800ms]">
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}