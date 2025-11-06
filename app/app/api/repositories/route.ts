
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
    const platform = searchParams.get('platform')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { userId: session.user.id }
    
    if (platform && platform !== 'all') {
      where.platform = platform.toUpperCase()
    }

    const repositories = await prisma.repository.findMany({
      where,
      include: {
        sourceMigrations: {
          select: {
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        targetMigrations: {
          select: {
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      repositories: repositories.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
        platform: repo.platform,
        owner: repo.owner,
        isPrivate: repo.isPrivate,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
        size: repo.size,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        lastSourceMigration: repo.sourceMigrations[0] || null,
        lastTargetMigration: repo.targetMigrations[0] || null
      }))
    })
  } catch (error) {
    console.error('Repositories API error:', error)
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
    const { url } = body

    // Mock repository data extraction
    const urlParts = url.split('/')
    const owner = urlParts[urlParts.length - 2]
    const repoName = urlParts[urlParts.length - 1].replace('.git', '')
    
    let platform = 'GITHUB'
    if (url.includes('gitlab.com')) platform = 'GITLAB'
    if (url.includes('bitbucket.org')) platform = 'BITBUCKET'

    const repository = await prisma.repository.upsert({
      where: {
        userId_url: {
          userId: session.user.id,
          url
        }
      },
      update: {
        updatedAt: new Date()
      },
      create: {
        name: repoName,
        fullName: `${owner}/${repoName}`,
        url,
        platform: platform as any,
        owner,
        userId: session.user.id,
        description: `Repository ${repoName} from ${platform}`,
        language: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'][Math.floor(Math.random() * 5)],
        stars: Math.floor(Math.random() * 1000),
        forks: Math.floor(Math.random() * 100),
        size: Math.floor(Math.random() * 50000) + 1000,
        isPrivate: Math.random() > 0.5
      }
    })

    return NextResponse.json({ repository })
  } catch (error) {
    console.error('Add repository error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
