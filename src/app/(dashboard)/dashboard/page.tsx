import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  FileText, 
  Upload, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Active users this month',
    },
    {
      title: 'Total Posts',
      value: '567',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: FileText,
      description: 'Published content',
    },
    {
      title: 'File Uploads',
      value: '89',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Upload,
      description: 'Files uploaded today',
    },
    {
      title: 'Revenue',
      value: '$12,345',
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Monthly revenue',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/avatars/john.jpg',
      },
      action: 'created a new post',
      target: 'Getting Started Guide',
      time: '2 minutes ago',
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '/avatars/jane.jpg',
      },
      action: 'uploaded a file',
      target: 'presentation.pdf',
      time: '5 minutes ago',
    },
    {
      id: 3,
      user: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: '/avatars/mike.jpg',
      },
      action: 'updated their profile',
      target: 'Profile Settings',
      time: '10 minutes ago',
    },
    {
      id: 4,
      user: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: '/avatars/sarah.jpg',
      },
      action: 'commented on',
      target: 'Feature Request #123',
      time: '15 minutes ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bug Capture Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your bug capture sessions today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button>
            <Activity className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your team and projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} <span className="font-medium">{activity.target}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/posts/new">
                <FileText className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/settings">
                <Activity className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system health and performance metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Database</span>
              <Badge variant="secondary">Healthy</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">API</span>
              <Badge variant="secondary">Operational</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium">Storage</span>
              <Badge variant="secondary">75% Used</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
