# Jira Adoption Dashboard Implementation Plan

## Overview
Transform the existing dashboard page to implement the Jira adoption dashboard as specified in `jira-adoption-dasboard.md`. The dashboard will focus on tracking bug capture session metrics and Jira ticket creation efficiency.

## Current State Analysis
- Existing dashboard has basic stats cards and activity feed
- Recharts library is already available for data visualization
- UI components (Card, Badge, Button, etc.) are available
- Need to replace generic content with Jira-specific metrics

## Implementation Plan

### Phase 1: Core Dashboard Structure
1. **North Star Metric Section**
   - Large headline metric: "% of Live sessions post-capture, resulting in a Jira ticket filed within 120 seconds, with ≥80% AI-generated content accepted as-is"
   - Big number display with sparkline trend
   - Week-over-week comparison

2. **Funnel Overview**
   - Stacked funnel visualization showing step-by-step drop-offs
   - Color-coded steps with conversion percentages
   - Steps: Live sessions → Sessions with capture → Jira modal opened → AI draft generated → Ticket filed → North Star achievement

### Phase 2: Segmented Trends
3. **Time Bucket Analysis**
   - Stacked bar chart for time ranges: <60s, 60–120s, 120–300s, 300s+
   - Hover details for each segment

4. **AI Acceptance Trends**
   - Line chart showing acceptance rates: 100%, 80–99%, 50–80%, <50%
   - Trend analysis over time

### Phase 3: Quality Metrics
5. **Quality Signals Panel**
   - Average time-to-ticket post-capture
   - Percentage of tickets with mandatory attachments
   - Percentage of tickets closed without clarification
   - Percentage flagged for extra info
   - CSAT scores with smiley ratings

6. **AI Edit Reasons**
   - Top 3 reasons for AI edits (dropdown/text analysis)
   - "Wanted to clarify repro steps", "Summary too vague", "Product-specific fields missing"

### Phase 4: Cohort Analysis
7. **Cohort Comparisons**
   - Organization breakdown (top 5 vs bottom 5)
   - User persona analysis (Power vs new users)
   - Browser/OS/Project adoption breakdowns

### Phase 5: Technical Metrics
8. **Supporting Technical Metrics**
   - API submission success rate
   - AI draft latency (p95)
   - Attachment upload success rate

### Phase 6: Dashboard Actions
9. **Filters and Controls**
   - Time range selector
   - Organization filter
   - Project filter
   - User persona filter
   - AI model version filter

10. **Export and Drill-down**
    - CSV/XLS export functionality
    - Click-to-drill-down on metrics
    - Alert system for metric drops

## Technical Implementation Details

### Components to Create
1. **NorthStarMetric.tsx** - Main headline metric with sparkline
2. **FunnelChart.tsx** - Stacked funnel visualization
3. **TimeBucketChart.tsx** - Time range analysis
4. **AIAcceptanceChart.tsx** - AI acceptance trends
5. **QualityMetricsPanel.tsx** - Quality signals display
6. **CohortAnalysis.tsx** - Organization/user breakdowns
7. **TechnicalMetrics.tsx** - API/performance metrics
8. **DashboardFilters.tsx** - Filter controls
9. **ExportControls.tsx** - Export functionality

### Data Structure
```typescript
interface DashboardData {
  northStarMetric: {
    percentage: number;
    trend: number[];
    weekOverWeek: number;
  };
  funnel: {
    steps: Array<{
      name: string;
      count: number;
      conversion: number;
      color: string;
    }>;
  };
  timeBuckets: {
    ranges: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  aiAcceptance: {
    categories: Array<{
      range: string;
      percentage: number;
      trend: number[];
    }>;
  };
  qualityMetrics: {
    avgTimeToTicket: number;
    mandatoryAttachments: number;
    noClarificationNeeded: number;
    flaggedForExtraInfo: number;
    csatScore: number;
  };
  topEditReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  cohorts: {
    organizations: Array<{
      name: string;
      adoption: number;
      rank: number;
    }>;
    personas: {
      powerUsers: number;
      newUsers: number;
    };
  };
  technicalMetrics: {
    apiSuccessRate: number;
    aiLatency: number;
    uploadSuccessRate: number;
  };
}
```

### Mock Data Strategy
- Create realistic mock data based on the specifications
- Include sample data for all metrics mentioned
- Ensure data shows realistic trends and relationships

### UI/UX Considerations
- Use consistent color scheme throughout
- Implement responsive design for mobile/tablet
- Add loading states for data fetching
- Include tooltips for metric explanations
- Use appropriate chart types for each data type

## Implementation Order & Task Tracking

### ✅ Phase 0: Setup & Data (Completed)
- [x] Create implementation plan
- [x] Create mock data JSON structure
- [x] Set up data types and interfaces
- [x] Create utility functions for data transformation

### ✅ Phase 1: Core Dashboard Structure (Completed)
- [x] Implement North Star metric component
- [x] Build funnel visualization
- [x] Create main dashboard layout

### ✅ Phase 2: Segmented Trends (Completed)
- [x] Add time bucket analysis chart
- [x] Implement AI acceptance trends chart
- [x] Add hover interactions and tooltips

### ⏳ Phase 3: Quality Metrics (Pending)
- [ ] Create quality signals panel
- [ ] Implement AI edit reasons analysis
- [ ] Add CSAT score visualization

### ⏳ Phase 4: Cohort Analysis (Pending)
- [ ] Build organization breakdown charts
- [ ] Implement user persona analysis
- [ ] Add browser/OS/Project breakdowns

### ⏳ Phase 5: Technical Metrics (Pending)
- [ ] Create technical metrics panel
- [ ] Implement API performance indicators
- [ ] Add system health monitoring

### ⏳ Phase 6: Dashboard Actions (Pending)
- [ ] Build filter controls
- [ ] Implement export functionality
- [ ] Add drill-down capabilities
- [ ] Create alert system

### ⏳ Phase 7: Integration & Polish (Pending)
- [ ] Integrate all components
- [ ] Add responsive design
- [ ] Implement loading states
- [ ] Final testing and optimization

## Dependencies
- Recharts (already available)
- Lucide React icons (already available)
- Existing UI components (Card, Badge, Button, etc.)
- No additional packages needed

## Estimated Timeline
- Phase 1-2: 2-3 hours
- Phase 3-4: 2-3 hours  
- Phase 5-6: 2-3 hours
- Total: 6-9 hours

## Success Criteria
- Dashboard matches the layout and metrics specified in jira-adoption-dasboard.md
- All visualizations are interactive and responsive
- Mock data accurately represents the intended metrics
- Code is well-structured and reusable
- Dashboard provides actionable insights for Jira adoption tracking
