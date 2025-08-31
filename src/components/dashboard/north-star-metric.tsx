'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { 
  getNorthStarSparklineData, 
  formatPercentage, 
  calculateTrend 
} from '@/lib/utils/dashboard-data';
import { ChartWrapper } from './chart-wrapper';
import type { NorthStarMetric } from '@/types/dashboard';

interface NorthStarMetricProps {
  data: NorthStarMetric;
}

export function NorthStarMetric({ data }: NorthStarMetricProps) {
  const sparklineData = getNorthStarSparklineData();
  const trend = calculateTrend(data.percentage, data.percentage - data.weekOverWeek);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-muted-foreground">
          North Star Metric
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Main Metric */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-4xl font-bold tracking-tight">
                  {formatPercentage(data.percentage)}
                </h2>
                <Badge 
                  variant={trend.direction === 'up' ? 'default' : trend.direction === 'down' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {trend.direction === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                  {trend.direction === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                  {trend.direction === 'stable' && <Minus className="mr-1 h-3 w-3" />}
                  {trend.value > 0 ? `+${trend.value.toFixed(1)}%` : '0%'} WoW
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                {data.description}
              </p>
            </div>
            
            {/* Week over Week */}
            <div className="flex items-center space-x-4 text-sm">
              <div>
                <span className="text-muted-foreground">Week over Week: </span>
                <span className={`font-medium ${trend.color}`}>
                  {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                  {formatPercentage(Math.abs(data.weekOverWeek))}
                </span>
              </div>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="h-40">
            <ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={sparklineData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <XAxis 
                  dataKey="name" 
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tickFormatter={(value) => `${value}%`}
                />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="text-sm font-medium">
                              {data.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatPercentage(data.value)} ({data.absoluteValue?.toLocaleString()} tickets)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                                  <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={1}
                  dot={{ fill: '#3b82f6', strokeWidth: 1, r: 2 }}
                  activeDot={{ r: 3, stroke: '#3b82f6', strokeWidth: 1 }}
                />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
