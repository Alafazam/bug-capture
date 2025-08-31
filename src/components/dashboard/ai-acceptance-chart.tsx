'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { getAIAcceptanceChartData } from '@/lib/utils/dashboard-data';
import { ChartWrapper } from './chart-wrapper';
import type { AIAcceptanceData } from '@/types/dashboard';

interface AIAcceptanceChartProps {
  data: AIAcceptanceData;
}

export function AIAcceptanceChart({ data }: AIAcceptanceChartProps) {
  const chartData = getAIAcceptanceChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Acceptance Trends</CardTitle>
        <p className="text-sm text-muted-foreground">
          Weekly trends in AI-generated content acceptance rates
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-80">
            <ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
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
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
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
                                {entry.name}: {entry.value}%
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                                  {data.categories.map((category, index) => (
                  <Line
                    key={category.range}
                    type="monotone"
                    dataKey={category.range}
                    stroke={category.color}
                    strokeWidth={1}
                    dot={{ fill: category.color, strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: category.color, strokeWidth: 1 }}
                    name={category.range}
                  />
                ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Current Percentages */}
          <div className="grid grid-cols-2 gap-4">
            {data.categories.map((category) => (
              <div key={category.range} className="text-center p-3 bg-muted/50 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: category.color }}
                />
                <p className="text-lg font-bold">{category.percentage}%</p>
                <p className="text-xs text-muted-foreground">{category.range}</p>
              </div>
            ))}
          </div>

          {/* Trend Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Acceptance Rate Summary</h4>
            <div className="grid grid-cols-1 gap-2">
              {data.categories.map((category) => {
                const trend = category.trend[category.trend.length - 1] - category.trend[0];
                const trendDirection = trend > 0 ? '↗️' : trend < 0 ? '↘️' : '→';
                const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';
                
                return (
                  <div key={category.range} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.range}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{category.percentage}%</span>
                      <span className={`text-sm ${trendColor}`}>
                        {trendDirection} {Math.abs(trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
