
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatBytes } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getAuth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

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
    const totalMigrations = migrationCounts.reduce((acc, item) => acc + item._count, 0)
    const completedMigrations = migrationCounts.find(item => item.status === 'COMPLETED')?._count || 0
    const inProgressMigrations = migrationCounts.find(item => item.status === 'IN_PROGRESS')?._count || 0
    const failedMigrations = migrationCounts.find(item => item.status === 'FAILED')?._count || 0
    const pendingMigrations = migrationCounts.find(item => item.status === 'PENDING')?._count || 0
    
    const successRate = totalMigrations > 0 ? Math.round((completedMigrations / totalMigrations) * 100) : 100

    // Get migration history for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const migrationHistory = await prisma.migration.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        status: true,
        createdAt: true,
        completedAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
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
      recentMigrations: recentMigrations.map(migration => ({
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
      })),
      migrationHistory
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
