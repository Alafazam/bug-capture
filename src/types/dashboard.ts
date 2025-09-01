export interface NorthStarMetric {
  percentage: number;
  trend: number[];
  weekOverWeek: number;
  description: string;
}

export interface WeeklyData {
  week: string;
  count: number;
  conversion: number;
}

export interface WeeklyTimeData {
  week: string;
  count: number;
  percentage: number;
}

export interface FunnelStep {
  name: string;
  count: number;
  conversion: number;
  color: string;
  description: string;
  weeklyData?: WeeklyData[];
}

export interface FunnelData {
  steps: FunnelStep[];
}

export interface TimeBucket {
  range: string;
  count: number;
  percentage: number;
  color: string;
  weeklyData?: WeeklyTimeData[];
}

export interface TimeBucketsData {
  ranges: TimeBucket[];
  total: number;
}

export interface AIAcceptanceCategory {
  range: string;
  percentage: number;
  trend: number[];
  color: string;
}

export interface AIAcceptanceData {
  categories: AIAcceptanceCategory[];
  weeks: string[];
}

export interface QualityMetrics {
  avgTimeToTicket: number;
  mandatoryAttachments: number;
  noClarificationNeeded: number;
  flaggedForExtraInfo: number;
  csatScore: number;
  csatResponses: number;
  csatBreakdown: {
    [key: string]: number;
  };
}

export interface EditReason {
  reason: string;
  count: number;
  percentage: number;
  color: string;
}

export interface Organization {
  name: string;
  adoption: number;
  rank: number;
  sessions: number;
  color: string;
}

export interface Persona {
  percentage: number;
  count: number;
  avgAdoption: number;
  color: string;
}

export interface Personas {
  powerUsers: Persona;
  newUsers: Persona;
}

export interface BrowserOSProject {
  name: string;
  percentage: number;
  adoption: number;
  color: string;
}

export interface Organizations {
  top5: Organization[];
  bottom5: Organization[];
}

export interface Cohorts {
  organizations: Organizations;
  personas: Personas;
  browsers: BrowserOSProject[];
  operatingSystems: BrowserOSProject[];
  projects: BrowserOSProject[];
}

export interface AILatency {
  p50: number;
  p95: number;
  p99: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime?: number;
  responseTime?: number;
  usage?: number;
  available?: string;
}

export interface TechnicalMetrics {
  apiSubmissionSuccessRate: number;
  aiDraftLatency: AILatency;
  uploadSuccessRate: number;
  systemHealth: {
    database: SystemHealth;
    api: SystemHealth;
    storage: SystemHealth;
  };
}

export interface Filters {
  timeRanges: string[];
  organizations: string[];
  projects: string[];
  userPersonas: string[];
  aiModelVersions: string[];
}

export interface Alert {
  triggered: boolean;
  threshold: number;
  currentDrop?: number;
  currentLatency?: number;
  currentRate?: number;
}

export interface Alerts {
  northStarDrop: Alert;
  aiLatencySpike: Alert;
  apiErrorRate: Alert;
}

export interface DashboardData {
  northStarMetric: NorthStarMetric;
  funnel: FunnelData;
  timeBuckets: TimeBucketsData;
  aiAcceptance: AIAcceptanceData;
  qualityMetrics: QualityMetrics;
  topEditReasons: EditReason[];
  cohorts: Cohorts;
  technicalMetrics: TechnicalMetrics;
  filters: Filters;
  alerts: Alerts;
  lastUpdated: string;
  dataRefreshInterval: number;
}

// Filter state interface
export interface DashboardFilters {
  timeRange: string;
  organization: string;
  project: string;
  userPersona: string;
  aiModelVersion: string;
}

// Chart data interfaces for Recharts
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface SparklineData {
  name: string;
  value: number;
  absoluteValue?: number;
}

export interface FunnelChartData {
  name: string;
  value: number;
  fill: string;
  conversion: number;
}

export interface TimeBucketChartData {
  range: string;
  count: number;
  percentage: number;
  fill: string;
}

export interface AIAcceptanceChartData {
  week: string;
  [key: string]: number | string;
}
