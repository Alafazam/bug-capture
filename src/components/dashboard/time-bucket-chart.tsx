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
import { formatNumber, formatPercentage, getTimeBucketChartData, getTimeBucketTrendData } from '@/lib/utils/dashboard-data';
import { ChartWrapper } from './chart-wrapper';
import type { TimeBucketsData } from '@/types/dashboard';

interface TimeBucketChartProps {
  data: TimeBucketsData;
}

export function TimeBucketChart({ data }: TimeBucketChartProps) {
  const chartData = getTimeBucketChartData();
  const trendData = getTimeBucketTrendData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time to Ticket Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution of time taken to file tickets after capture
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-80">
            <ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                  <XAxis 
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatNumber(value)}
                    axisLine={false}
                    tickLine={false}
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
                                {entry.name}: {formatNumber(entry.value)}
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
                    dataKey="<60s" 
                    stroke="#10b981" 
                    strokeWidth={1}
                    dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 1 }}
                    name="<60s"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="60–120s" 
                    stroke="#3b82f6" 
                    strokeWidth={1}
                    dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1 }}
                    name="60–120s"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="120–300s" 
                    stroke="#f59e0b" 
                    strokeWidth={1}
                    dot={{ fill: '#f59e0b', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#f59e0b', strokeWidth: 1 }}
                    name="120–300s"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="300s+" 
                    stroke="#ef4444" 
                    strokeWidth={1}
                    dot={{ fill: '#ef4444', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#ef4444', strokeWidth: 1 }}
                    name="300s+"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(data.ranges.find(r => r.range === '<60s')?.count || 0)}
              </p>
              <p className="text-xs text-muted-foreground">Under 60s</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(data.ranges.find(r => r.range === '60–120s')?.count || 0)}
              </p>
              <p className="text-xs text-muted-foreground">60-120s</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Time Range Breakdown</h4>
            {data.ranges.map((range) => (
              <div key={range.range} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: range.color }}
                  />
                  <span className="text-sm font-medium">{range.range}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatNumber(range.count)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(range.percentage)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
