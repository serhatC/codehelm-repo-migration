
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  GitBranch, 
  Github, 
  GitlabIcon as Gitlab, 
  Database as Bitbucket,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react'
import Link from 'next/link'
import { getTimeAgo } from '@/lib/utils'
import { PLATFORM_CONFIGS, STATUS_COLORS } from '@/lib/types'

interface RecentMigrationsProps {
  migrations: any[]
}

const platformIcons = {
  GITHUB: Github,
  GITLAB: Gitlab,
  BITBUCKET: Bitbucket
}

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
  PAUSED: Pause,
  CANCELLED: XCircle
}

export function RecentMigrations({ migrations = [] }: RecentMigrationsProps) {
  if (migrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Migrations</CardTitle>
          <CardDescription>Your latest migration activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <GitBranch className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No migrations yet. Start your first migration to see activity here.
            </p>
            <Button asChild className="mt-4">
              <Link href="/migrate">Create Migration</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Migrations</CardTitle>
          <CardDescription>Your latest migration activities</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/history">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {migrations.map((migration) => {
          const SourceIcon = platformIcons[migration.sourcePlatform as keyof typeof platformIcons]
          const TargetIcon = platformIcons[migration.targetPlatform as keyof typeof platformIcons]
          const StatusIcon = statusIcons[migration.status as keyof typeof statusIcons]
          
          return (
            <div
              key={migration.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                {/* Platform Icons */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <SourceIcon className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <TargetIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Migration Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium truncate">{migration.title}</p>
                    <Badge 
                      variant="outline" 
                      className={STATUS_COLORS[migration.status as keyof typeof STATUS_COLORS]}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {migration.status.toLowerCase()}
                    </Badge>
                  </div>
                  
                  {migration.status === 'IN_PROGRESS' && (
                    <div className="mb-2">
                      <Progress value={migration.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {migration.progress}% complete
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{migration.sourceRepository?.name || 'Unknown repo'}</span>
                    <span>•</span>
                    <span>{getTimeAgo(new Date(migration.updatedAt))}</span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/migrations/${migration.id}`}>
                  View
                </Link>
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
