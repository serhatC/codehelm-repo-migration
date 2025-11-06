
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentMigrations } from '@/components/dashboard/recent-migrations'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, GitBranch, History, Crown } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatBytes } from '@/lib/utils'

async function getDashboardData(userId: string) {
  try {
    // Get migration counts by status
    const migrationCounts = await prisma.migration.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    })

    // Get total repositories
    const totalRepositories = await prisma.repository.count({
      where: { userId }
    })

    // Get total data transferred (sum of migratedSize)
    const dataTransferred = await prisma.migration.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { migratedSize: true }
    })

    // Get recent migrations
    const recentMigrations = await prisma.migration.findMany({
      where: { userId },
      include: {
        sourceRepository: true,
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })

    // Calculate stats
    const totalMigrations = migrationCounts.reduce((acc: number, item: any) => acc + item._count, 0)
    const completedMigrations = migrationCounts.find((item: any) => item.status === 'COMPLETED')?._count || 0
    const inProgressMigrations = migrationCounts.find((item: any) => item.status === 'IN_PROGRESS')?._count || 0
    const failedMigrations = migrationCounts.find((item: any) => item.status === 'FAILED')?._count || 0
    const pendingMigrations = migrationCounts.find((item: any) => item.status === 'PENDING')?._count || 0
    
    const successRate = totalMigrations > 0 ? Math.round((completedMigrations / totalMigrations) * 100) : 100

    return {
      stats: {
        totalMigrations,
        completedMigrations,
        inProgressMigrations,
        failedMigrations,
        pendingMigrations,
        totalRepositories,
        dataTransferred: formatBytes(Number(dataTransferred._sum.migratedSize || 0)),
        successRate
      },
      recentMigrations: recentMigrations.map((migration: any) => ({
        id: migration.id,
        title: migration.title,
        status: migration.status,
        progress: migration.progress,
        sourcePlatform: migration.sourcePlatform,
        targetPlatform: migration.targetPlatform,
        sourceRepository: migration.sourceRepository,
        createdAt: migration.createdAt,
        updatedAt: migration.updatedAt,
        lastLog: migration.logs[0] || null
      }))
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return {
      stats: {
        totalMigrations: 0,
        completedMigrations: 0,
        inProgressMigrations: 0,
        failedMigrations: 0,
        pendingMigrations: 0,
        totalRepositories: 0,
        dataTransferred: '0 B',
        successRate: 100
      },
      recentMigrations: []
    }
  }
}

export default async function DashboardPage() {
  const session = await getAuth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const { stats, recentMigrations } = await getDashboardData(session.user.id)

  return (
    <div className="container-responsive py-8">
      {/* Header */}
      <div className="flex flex-col space-y-2 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your repository migration activities.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/migrate">
                <Plus className="mr-2 h-4 w-4" />
                New Migration
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Migrations - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentMigrations migrations={recentMigrations} />
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* Premium Upgrade Card */}
          {!session.user.isPremium && (
            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-yellow-800">Upgrade to Premium</CardTitle>
                </div>
                <CardDescription className="text-yellow-700">
                  Unlock advanced features like LFS support, bulk migrations, and priority processing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700" asChild>
                  <Link href="/premium">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">This month</span>
                <span className="font-medium">{stats?.totalMigrations || 0} migrations</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Success rate</span>
                <span className="font-medium text-green-600">{stats?.successRate || 100}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Data transferred</span>
                <span className="font-medium">{stats?.dataTransferred || '0 B'}</span>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/history">
                  <History className="mr-2 h-4 w-4" />
                  View Full History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
