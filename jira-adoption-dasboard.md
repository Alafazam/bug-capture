# Jira Capture — Adoption Dashboard (Sample Layout)

## North Star Metric
Headline:
% of Live sessions post-capture, resulting in a Jira ticket filed within 120 seconds, with ≥80% AI-generated content accepted as-is

Big number on top, sparkline trending week-over-week.

## Funnel Overview
### Stacked funnel bar: Step-by-step drop-offs; color-code each step.
| Step | Count | Conversion (%) |
| ------------- | ------------- | ------------- |
| Live sessions (total) | 20,000 | — |
| Sessions with capture (post-capture) | 10,000 | 50% |
| Capture → Jira modal opened | 6,000 | 60% |
| AI draft generated | 6,000 | 100% |
| Ticket filed (any) | 4,500 | 75% |
| North Star (filed <120s, ≥80% AI accepted) | 3,000 | 66.7% |



## Segmented Trends

### By Time Buckets:
<60s
60–120s
120–300s
300s

(Stacked bar with hover details)


### By AI Acceptance:
100% accepted as-is
80–99%
50–80%
<50% (distinct lines)

### Quality Signals
Avg. time-to-ticket post-capture: e.g., 74 seconds
% tickets filed with all mandatory attachments: e.g., 95%
% tickets closed with no clarification asked (Jira-side sync): e.g., 87%
% tickets flagged for extra info post filing: e.g., 10%
CSAT: “How easy was this Jira creation?” (smileys, trend by week)

Top 3 reasons for AI-edit (from drop-down or text):
“Wanted to clarify repro steps”
“Summary too vague”
“Product-specific fields missing”

Cohort Comparisons
By org: Top 5 orgs by adoption / Bottom 5 (bar/heatmap)
By tester persona: Power vs new users
By browser/OS/project: Adoption breakdowns

Supporting Technical Metrics (mini-panels)
API submission success rate: 99.8%
AI draft latency (p95): 1.2s
Attachment upload success: 98.9%

## Dashboard Actions
Filters: Time-range, org, project, user persona, AI model version
Export: CSV/XLS (raw events, summary stats)
Drill-down: Click any metric to see session/journey samples
Alert: Flag if North Star falls by >10% WoW or AI latency spikes