import dashboardData from '../data/dashboard-mock-data.json';
import type { DashboardData, SparklineData, FunnelChartData, TimeBucketChartData, AIAcceptanceChartData } from '@/types/dashboard';

export function getDashboardData(): DashboardData {
  return dashboardData as DashboardData;
}

export function getNorthStarSparklineData(): SparklineData[] {
  const data = getDashboardData();
  const totalLiveSessions = data.funnel.steps[0].weeklyData;
  
  return data.northStarMetric.trend.map((percentage, index) => {
    const weekLiveSessions = totalLiveSessions[index]?.count || 20000;
    const absoluteValue = Math.round((percentage / 100) * weekLiveSessions);
    
    return {
      name: `Week ${index + 1}`,
      value: percentage,
      absoluteValue
    };
  });
}

export function getFunnelChartData(): FunnelChartData[] {
  const data = getDashboardData();
  return data.funnel.steps.map(step => ({
    name: step.name,
    value: step.count,
    fill: step.color,
    conversion: step.conversion
  }));
}

export function getTimeBucketChartData(): TimeBucketChartData[] {
  const data = getDashboardData();
  return data.timeBuckets.ranges.map(range => ({
    range: range.range,
    count: range.count,
    percentage: range.percentage,
    fill: range.color
  }));
}

export function getAIAcceptanceChartData(): AIAcceptanceChartData[] {
  const data = getDashboardData();
  const weeks = data.aiAcceptance.weeks;
  
  return weeks.map((week, weekIndex) => {
    const chartData: AIAcceptanceChartData = { week };
    
    data.aiAcceptance.categories.forEach(category => {
      chartData[category.range] = category.trend[weekIndex];
    });
    
    return chartData;
  });
}

export function getFunnelTrendData(): any[] {
  const data = getDashboardData();
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];
  
  return weeks.map((week, weekIndex) => {
    const chartData: any = { week };
    
    data.funnel.steps.forEach(step => {
      if (step.weeklyData && step.weeklyData[weekIndex]) {
        chartData[step.name] = step.weeklyData[weekIndex].count;
        chartData[`${step.name} Conversion`] = step.weeklyData[weekIndex].conversion;
      }
    });
    
    return chartData;
  });
}

export function getTimeBucketTrendData(): any[] {
  const data = getDashboardData();
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];
  
  return weeks.map((week, weekIndex) => {
    const chartData: any = { week };
    
    data.timeBuckets.ranges.forEach(range => {
      if (range.weeklyData && range.weeklyData[weekIndex]) {
        chartData[range.range] = range.weeklyData[weekIndex].count;
        chartData[`${range.range} %`] = range.weeklyData[weekIndex].percentage;
      }
    });
    
    return chartData;
  });
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
    case 'operational':
      return '#10b981';
    case 'warning':
      return '#f59e0b';
    case 'error':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'healthy':
    case 'operational':
      return '🟢';
    case 'warning':
      return '🟡';
    case 'error':
      return '🔴';
    default:
      return '⚪';
  }
}

export function calculateTrend(current: number, previous: number): {
  value: number;
  direction: 'up' | 'down' | 'stable';
  color: string;
} {
  const change = current - previous;
  const percentage = previous > 0 ? (change / previous) * 100 : 0;
  
  if (Math.abs(percentage) < 0.1) {
    return { value: 0, direction: 'stable', color: '#6b7280' };
  }
  
  return {
    value: Math.abs(percentage),
    direction: percentage > 0 ? 'up' : 'down',
    color: percentage > 0 ? '#10b981' : '#ef4444'
  };
}

export function getCSATEmoji(score: number): string {
  if (score >= 4.5) return '😄';
  if (score >= 4.0) return '🙂';
  if (score >= 3.0) return '😐';
  if (score >= 2.0) return '😕';
  return '😞';
}

export function getCSATColor(score: number): string {
  if (score >= 4.5) return '#10b981';
  if (score >= 4.0) return '#3b82f6';
  if (score >= 3.0) return '#f59e0b';
  if (score >= 2.0) return '#f97316';
  return '#ef4444';
}
