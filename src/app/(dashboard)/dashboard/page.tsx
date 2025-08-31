import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Activity,
  Download,
  Filter
} from 'lucide-react';
import { NorthStarMetric } from '@/components/dashboard/north-star-metric';
import { FunnelChart } from '@/components/dashboard/funnel-chart';
import { TimeBucketChart } from '@/components/dashboard/time-bucket-chart';
import { AIAcceptanceChart } from '@/components/dashboard/ai-acceptance-chart';
import { getDashboardData } from '@/lib/utils/dashboard-data';

export default function DashboardPage() {
  const dashboardData = getDashboardData();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jira Adoption Dashboard</h1>
          <p className="text-muted-foreground">
            Track bug capture session metrics and Jira ticket creation efficiency.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Activity className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* North Star Metric */}
      <NorthStarMetric data={dashboardData.northStarMetric} />

      {/* Main Dashboard Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Funnel Chart */}
        <FunnelChart data={dashboardData.funnel} />
        
        {/* Time Bucket Analysis */}
        <TimeBucketChart data={dashboardData.timeBuckets} />
      </div>

      {/* AI Acceptance Trends */}
      <AIAcceptanceChart data={dashboardData.aiAcceptance} />
    </div>
  );
}
