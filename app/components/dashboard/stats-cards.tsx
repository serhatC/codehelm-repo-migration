
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GitBranch, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Database,
  TrendingUp,
  Pause
} from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalMigrations: number
    completedMigrations: number
    inProgressMigrations: number
    failedMigrations: number
    pendingMigrations: number
    totalRepositories: number
    dataTransferred: string
    successRate: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Migrations',
      value: stats?.totalMigrations || 0,
      icon: GitBranch,
      description: 'All time migrations',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: stats?.completedMigrations || 0,
      icon: CheckCircle,
      description: 'Successful migrations',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'In Progress',
      value: stats?.inProgressMigrations || 0,
      icon: Clock,
      description: 'Currently running',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Failed',
      value: stats?.failedMigrations || 0,
      icon: XCircle,
      description: 'Need attention',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Repositories',
      value: stats?.totalRepositories || 0,
      icon: Database,
      description: 'Connected repos',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 100}%`,
      icon: TrendingUp,
      description: stats?.dataTransferred || '0 B',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
