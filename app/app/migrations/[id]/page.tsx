
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  Github,
  GitlabIcon as Gitlab,
  Database as Bitbucket,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  AlertTriangle,
  Info,
  FileText,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatBytes, formatDuration, getTimeAgo } from '@/lib/utils'
import { STATUS_COLORS, LOG_LEVEL_COLORS } from '@/lib/types'
import { prisma } from '@/lib/db'

const platformIcons = {
  GITHUB: Github,
  GITLAB: Gitlab,
  BITBUCKET: Bitbucket
}

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: Play,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
  PAUSED: Pause,
  CANCELLED: XCircle
}

const logIcons = {
  INFO: Info,
  WARNING: AlertTriangle,
  ERROR: XCircle,
  SUCCESS: CheckCircle
}

async function getMigration(id: string, userId: string) {
  try {
    const migration = await prisma.migration.findFirst({
      where: {
        id,
        userId
      },
      include: {
        sourceRepository: true,
        targetRepository: true,
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 50
        }
      }
    })
    return migration
  } catch (error) {
    console.error('Failed to fetch migration:', error)
    return null
  }
}

export default async function MigrationDetailPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getAuth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const migration = await getMigration(params.id, session.user.id)

  if (!migration) {
    return (
      <div className="container-responsive py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Migration Not Found</h1>
            <p className="text-muted-foreground">
              The migration you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
          <Button asChild>
            <Link href="/history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const SourceIcon = platformIcons[migration.sourcePlatform as keyof typeof platformIcons]
  const TargetIcon = platformIcons[migration.targetPlatform as keyof typeof platformIcons]
  const StatusIcon = statusIcons[migration.status as keyof typeof statusIcons]

  return (
    <div className="container-responsive py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{migration.title}</h1>
              <p className="text-muted-foreground">
                {migration.description || 'No description provided'}
              </p>
            </div>
            
            <Badge 
              variant="outline" 
              className={STATUS_COLORS[migration.status as keyof typeof STATUS_COLORS]}
            >
              <StatusIcon className="h-4 w-4 mr-2" />
              {migration.status.toLowerCase().replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Migration Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Migration Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform Flow */}
                <div className="flex items-center justify-center space-x-6 p-6 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-background border shadow-sm flex items-center justify-center mb-2">
                      <SourceIcon className="h-8 w-8" />
                    </div>
                    <p className="font-medium">{migration.sourcePlatform}</p>
                    <p className="text-sm text-muted-foreground">Source</p>
                  </div>
                  
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-background border shadow-sm flex items-center justify-center mb-2">
                      <TargetIcon className="h-8 w-8" />
                    </div>
                    <p className="font-medium">{migration.targetPlatform}</p>
                    <p className="text-sm text-muted-foreground">Target</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {migration.status === 'IN_PROGRESS' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Migration Progress</span>
                      <span className="text-sm text-muted-foreground">{migration.progress}%</span>
                    </div>
                    <Progress value={migration.progress} className="h-3" />
                  </div>
                )}

                {/* URLs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Source Repository</label>
                    <p className="text-sm text-muted-foreground truncate">{migration.sourceUrl}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Repository</label>
                    <p className="text-sm text-muted-foreground truncate">
                      {migration.targetUrl || 'To be created'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Migration Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Migration Logs</span>
                </CardTitle>
                <CardDescription>
                  Detailed log of migration activities and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {migration.logs?.length > 0 ? (
                    migration.logs.map((log: any) => {
                      const LogIcon = logIcons[log.level as keyof typeof logIcons]
                      return (
                        <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="flex-shrink-0 mt-0.5">
                            <LogIcon className={`h-4 w-4 ${LOG_LEVEL_COLORS[log.level as keyof typeof LOG_LEVEL_COLORS]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium">{log.message}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {getTimeAgo(new Date(log.timestamp))}
                              </span>
                            </div>
                            {log.details && (
                              <p className="text-xs text-muted-foreground">{log.details}</p>
                            )}
                            {log.component && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {log.component}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No logs available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Migration Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm font-medium">
                      {migration.type?.replace('_', ' ') || 'Code Only'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Files</span>
                    <span className="text-sm font-medium">
                      {migration.migratedFiles?.toLocaleString()}/{migration.totalFiles?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data Size</span>
                    <span className="text-sm font-medium">
                      {formatBytes(Number(migration.totalSize || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{migration.progress}%</span>
                  </div>
                  {migration.estimatedTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Est. Time</span>
                      <span className="text-sm font-medium">
                        {formatDuration(migration.estimatedTime)}
                      </span>
                    </div>
                  )}
                  {migration.actualTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm font-medium">
                        {formatDuration(migration.actualTime)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(new Date(migration.createdAt))}
                      </p>
                    </div>
                  </div>
                  
                  {migration.startedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">Started</p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(new Date(migration.startedAt))}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {migration.completedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(new Date(migration.completedAt))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {migration.status === 'IN_PROGRESS' && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <form action="#" method="POST">
                    <Button 
                      variant="outline" 
                      className="w-full mb-2"
                      type="submit"
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Migration
                    </Button>
                  </form>
                  <form action="#" method="POST">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      type="submit"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Migration
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
