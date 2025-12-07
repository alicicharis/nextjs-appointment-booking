import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span
                className={`font-medium ${
                  trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {change}
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Appointments"
        value={24}
        change="+12.5%"
        trend="up"
        icon={<Calendar className="size-6" />}
      />
      <StatCard
        title="Upcoming Today"
        value={5}
        change="+2"
        trend="up"
        icon={<Clock className="size-6" />}
      />
      <StatCard
        title="Active Clients"
        value={18}
        change="+5.2%"
        trend="up"
        icon={<Users className="size-6" />}
      />
      <StatCard
        title="Revenue"
        value="$2,450"
        change="+8.1%"
        trend="up"
        icon={<TrendingUp className="size-6" />}
      />
    </div>
  );
}
