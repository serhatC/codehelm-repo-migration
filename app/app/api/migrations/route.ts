
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getAuth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = { userId: session.user.id }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (platform && platform !== 'all') {
      where.OR = [
        { sourcePlatform: platform.toUpperCase() },
        { targetPlatform: platform.toUpperCase() }
      ]
    }

    const migrations = await prisma.migration.findMany({
      where,
      include: {
        sourceRepository: true,
        targetRepository: true,
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 3
        },
        _count: {
          select: { logs: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.migration.count({ where })

    return NextResponse.json({
      migrations: migrations.map(migration => ({
        id: migration.id,
        title: migration.title,
        description: migration.description,
        status: migration.status,
        type: migration.type,
        progress: migration.progress,
        sourcePlatform: migration.sourcePlatform,
        targetPlatform: migration.targetPlatform,
        sourceUrl: migration.sourceUrl,
        targetUrl: migration.targetUrl,
        sourceRepository: migration.sourceRepository,
        targetRepository: migration.targetRepository,
        startedAt: migration.startedAt,
        completedAt: migration.completedAt,
        estimatedTime: migration.estimatedTime,
        actualTime: migration.actualTime,
        totalFiles: migration.totalFiles,
        migratedFiles: migration.migratedFiles,
        totalSize: migration.totalSize.toString(),
        migratedSize: migration.migratedSize.toString(),
        errorCount: migration.errorCount,
        warningCount: migration.warningCount,
        recentLogs: migration.logs,
        totalLogs: migration._count.logs,
        createdAt: migration.createdAt,
        updatedAt: migration.updatedAt
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Migrations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      sourceUrl,
      targetUrl,
      sourcePlatform,
      targetPlatform,
      type = 'CODE_ONLY'
    } = body

    // Create or find source repository
    const sourceRepo = await prisma.repository.upsert({
      where: {
        userId_url: {
          userId: session.user.id,
          url: sourceUrl
        }
      },
      update: {},
      create: {
        name: sourceUrl.split('/').pop()?.replace('.git', '') || 'Unknown',
        fullName: sourceUrl.split('/').slice(-2).join('/').replace('.git', ''),
        url: sourceUrl,
        platform: sourcePlatform,
        owner: sourceUrl.split('/').slice(-2, -1)[0] || 'Unknown',
        userId: session.user.id
      }
    })

    // Create migration
    const migration = await prisma.migration.create({
      data: {
        title,
        description,
        sourceUrl,
        targetUrl,
        sourcePlatform,
        targetPlatform,
        type,
        status: 'PENDING',
        sourceRepoId: sourceRepo.id,
        userId: session.user.id,
        estimatedTime: Math.floor(Math.random() * 120) + 30, // Mock estimation
        totalFiles: Math.floor(Math.random() * 500) + 50,
        totalSize: BigInt(Math.floor(Math.random() * 100000000) + 10000000)
      }
    })

    // Create initial log
    await prisma.migrationLog.create({
      data: {
        migrationId: migration.id,
        level: 'INFO',
        message: 'Migration created and queued for processing',
        component: 'system'
      }
    })

    return NextResponse.json({ migration })
  } catch (error) {
    console.error('Create migration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
