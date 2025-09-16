
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Github, 
  GitlabIcon as Gitlab, 
  Database as Bitbucket,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { getTimeAgo, formatBytes, formatDuration } from '@/lib/utils'
import { STATUS_COLORS } from '@/lib/types'

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

export default function HistoryPage() {
  const [migrations, setMigrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    platform: 'all',
    search: ''
  })

  useEffect(() => {
    fetchMigrations()
  }, [filters])

  const fetchMigrations = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status !== 'all') params.set('status', filters.status)
      if (filters.platform !== 'all') params.set('platform', filters.platform)
      if (filters.search) params.set('search', filters.search)

      const response = await fetch(`/api/migrations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setMigrations(data.migrations || [])
      }
    } catch (error) {
      console.error('Failed to fetch migrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'text-yellow-600',
      IN_PROGRESS: 'text-blue-600',
      COMPLETED: 'text-green-600',
      FAILED: 'text-red-600',
      PAUSED: 'text-gray-600',
      CANCELLED: 'text-red-600'
    }
    return colors[status as keyof typeof colors] || 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-responsive py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Migration History</h1>
            <p className="text-muted-foreground">
              Track and manage all your repository migrations
            </p>
          </div>
          <Button asChild>
            <Link href="/migrate">New Migration</Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search migrations..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.platform} onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="gitlab">GitLab</SelectItem>
                  <SelectItem value="bitbucket">Bitbucket</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Migration List */}
        <div className="space-y-4">
          {migrations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No migrations found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.status !== 'all' || filters.platform !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'Start your first migration to see history here.'
                  }
                </p>
                <Button asChild>
                  <Link href="/migrate">Create Migration</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            migrations.map((migration: any) => {
              const SourceIcon = platformIcons[migration.sourcePlatform as keyof typeof platformIcons]
              const TargetIcon = platformIcons[migration.targetPlatform as keyof typeof platformIcons]
              const StatusIcon = statusIcons[migration.status as keyof typeof statusIcons]

              return (
                <Card key={migration.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {/* Platform Flow */}
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
                        <div>
                          <h3 className="font-semibold text-lg">{migration.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {migration.sourceRepository?.name || 'Unknown repository'}
                          </p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="outline"
                          className={STATUS_COLORS[migration.status as keyof typeof STATUS_COLORS]}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {migration.status.toLowerCase().replace('_', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/migrations/${migration.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar for In-Progress */}
                    {migration.status === 'IN_PROGRESS' && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Migration Progress</span>
                          <span className="text-sm text-muted-foreground">{migration.progress}%</span>
                        </div>
                        <Progress value={migration.progress} className="h-2" />
                      </div>
                    )}

                    {/* Migration Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="text-sm font-medium">{migration.type?.replace('_', ' ') || 'Code Only'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Files</p>
                        <p className="text-sm font-medium">
                          {migration.migratedFiles}/{migration.totalFiles}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data Size</p>
                        <p className="text-sm font-medium">
                          {formatBytes(Number(migration.totalSize || 0))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">
                          {migration.actualTime 
                            ? formatDuration(migration.actualTime)
                            : migration.estimatedTime 
                              ? `~${formatDuration(migration.estimatedTime)}`
                              : 'N/A'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Migration Metadata */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {getTimeAgo(new Date(migration.createdAt))}</span>
                        </span>
                        {migration.errorCount > 0 && (
                          <span className="text-red-600">
                            {migration.errorCount} errors
                          </span>
                        )}
                        {migration.warningCount > 0 && (
                          <span className="text-yellow-600">
                            {migration.warningCount} warnings
                          </span>
                        )}
                      </div>
                      
                      {migration.completedAt && (
                        <span>Completed {getTimeAgo(new Date(migration.completedAt))}</span>
                      )}
                    </div>

                    {/* Recent Logs Preview */}
                    {migration.recentLogs && migration.recentLogs.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Recent Activity</p>
                        <div className="space-y-1">
                          {migration.recentLogs.slice(0, 2).map((log: any) => (
                            <div key={log.id} className="flex items-center space-x-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${
                                log.level === 'ERROR' ? 'bg-red-500' :
                                log.level === 'WARNING' ? 'bg-yellow-500' :
                                log.level === 'SUCCESS' ? 'bg-green-500' :
                                'bg-blue-500'
                              }`} />
                              <span className="text-muted-foreground truncate">{log.message}</span>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {getTimeAgo(new Date(log.timestamp))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Load More Button - if needed */}
        {migrations.length > 0 && migrations.length % 10 === 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => fetchMigrations()}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
