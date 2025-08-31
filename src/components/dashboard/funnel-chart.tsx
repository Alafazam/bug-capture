'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ComposedChart, 
  Bar, 
  Line,
  ResponsiveContainer, 
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatNumber, formatPercentage, getFunnelChartData, getFunnelTrendData } from '@/lib/utils/dashboard-data';
import { ChartWrapper } from './chart-wrapper';
import type { FunnelData } from '@/types/dashboard';

interface FunnelChartProps {
  data: FunnelData;
}

export function FunnelChart({ data }: FunnelChartProps) {
  const chartData = getFunnelChartData();
  const trendData = getFunnelTrendData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Step-by-step conversion tracking with drop-off analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Funnel Trend Chart */}
          <div className="h-96">
            <ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={trendData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis 
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString()}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 20000]}
                    ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000]}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium text-sm">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                <span 
                                  className="inline-block w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: entry.color }}
                                />
                                {entry.name}: {entry.value.toLocaleString()}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Live sessions (total)" 
                    stroke="#3b82f6" 
                    strokeWidth={1}
                    dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1 }}
                    name="Live Sessions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Sessions with capture (post-capture)" 
                    stroke="#06b6d4" 
                    strokeWidth={1}
                    dot={{ fill: '#06b6d4', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#06b6d4', strokeWidth: 1 }}
                    name="Sessions with Capture"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Capture → Jira modal opened" 
                    stroke="#10b981" 
                    strokeWidth={1}
                    dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 1 }}
                    name="Jira Modal Opened"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="AI draft generated" 
                    stroke="#f59e0b" 
                    strokeWidth={1}
                    dot={{ fill: '#f59e0b', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#f59e0b', strokeWidth: 1 }}
                    name="AI Draft Generated"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Ticket filed (any)" 
                    stroke="#ef4444" 
                    strokeWidth={1}
                    dot={{ fill: '#ef4444', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#ef4444', strokeWidth: 1 }}
                    name="Ticket Filed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="North Star (filed <120s, ≥80% AI accepted)" 
                    stroke="#8b5cf6" 
                    strokeWidth={1}
                    dot={{ fill: '#8b5cf6', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 1 }}
                    name="North Star"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Conversion Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Conversion Details</h4>
            <div className="space-y-2">
              {data.steps.map((step, index) => (
                <div key={step.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: step.color }}
                    />
                    <div>
                      <p className="text-sm font-medium">{step.name}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{step.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage(step.conversion)} conversion
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
