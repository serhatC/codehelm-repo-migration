
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      companyName: 'Tech Corp',
      password: hashedPassword,
      isPremium: true,
    },
  })

  // Create additional test users
  const normalUser = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
      companyName: 'StartupCo',
      password: await bcrypt.hash('password123', 12),
      isPremium: false,
    },
  })

  // Create sample repositories
  const repositories = [
    {
      name: 'awesome-project',
      fullName: 'john-doe/awesome-project',
      url: 'https://github.com/john-doe/awesome-project',
      platform: 'GITHUB' as const,
      owner: 'john-doe',
      isPrivate: false,
      description: 'An awesome open source project with lots of features',
      language: 'TypeScript',
      stars: 1250,
      forks: 180,
      size: 15680,
      userId: adminUser.id,
    },
    {
      name: 'legacy-api',
      fullName: 'techcorp/legacy-api',
      url: 'https://bitbucket.org/techcorp/legacy-api',
      platform: 'BITBUCKET' as const,
      owner: 'techcorp',
      isPrivate: true,
      description: 'Legacy REST API that needs migration',
      language: 'Java',
      stars: 45,
      forks: 12,
      size: 89560,
      userId: adminUser.id,
    },
    {
      name: 'mobile-app',
      fullName: 'jane-smith/mobile-app',
      url: 'https://gitlab.com/jane-smith/mobile-app',
      platform: 'GITLAB' as const,
      owner: 'jane-smith',
      isPrivate: true,
      description: 'React Native mobile application',
      language: 'JavaScript',
      stars: 89,
      forks: 23,
      size: 45230,
      userId: normalUser.id,
    },
    {
      name: 'data-pipeline',
      fullName: 'techcorp/data-pipeline',
      url: 'https://github.com/techcorp/data-pipeline',
      platform: 'GITHUB' as const,
      owner: 'techcorp',
      isPrivate: true,
      description: 'Machine learning data processing pipeline',
      language: 'Python',
      stars: 340,
      forks: 67,
      size: 123450,
      userId: adminUser.id,
    },
  ]

  const createdRepos = []
  for (const repo of repositories) {
    const created = await prisma.repository.upsert({
      where: { userId_url: { userId: repo.userId, url: repo.url } },
      update: {},
      create: repo,
    })
    createdRepos.push(created)
  }

  // Create sample migrations with various statuses
  const migrations = [
    {
      title: 'Migrate awesome-project to GitLab',
      description: 'Moving our main project from GitHub to GitLab for better CI/CD',
      status: 'COMPLETED' as const,
      type: 'FULL_MIRROR' as const,
      progress: 100,
      sourceRepoId: createdRepos[0].id,
      sourcePlatform: 'GITHUB' as const,
      targetPlatform: 'GITLAB' as const,
      sourceUrl: 'https://github.com/john-doe/awesome-project',
      targetUrl: 'https://gitlab.com/john-doe/awesome-project',
      userId: adminUser.id,
      startedAt: new Date('2024-01-15T10:00:00Z'),
      completedAt: new Date('2024-01-15T11:30:00Z'),
      estimatedTime: 90,
      actualTime: 90,
      totalFiles: 245,
      migratedFiles: 245,
      totalSize: 15680000n,
      migratedSize: 15680000n,
      errorCount: 0,
      warningCount: 3,
    },
    {
      title: 'Legacy API Migration',
      description: 'Moving legacy Bitbucket repository to GitHub',
      status: 'IN_PROGRESS' as const,
      type: 'WITH_PULL_REQUESTS' as const,
      progress: 65,
      sourceRepoId: createdRepos[1].id,
      sourcePlatform: 'BITBUCKET' as const,
      targetPlatform: 'GITHUB' as const,
      sourceUrl: 'https://bitbucket.org/techcorp/legacy-api',
      targetUrl: 'https://github.com/techcorp/legacy-api-new',
      userId: adminUser.id,
      startedAt: new Date('2024-01-20T14:00:00Z'),
      estimatedTime: 180,
      totalFiles: 456,
      migratedFiles: 296,
      totalSize: 89560000n,
      migratedSize: 58214000n,
      errorCount: 2,
      warningCount: 8,
    },
    {
      title: 'Mobile App Repository',
      description: 'Migrating React Native app from GitLab to GitHub',
      status: 'FAILED' as const,
      type: 'CODE_ONLY' as const,
      progress: 25,
      sourceRepoId: createdRepos[2].id,
      sourcePlatform: 'GITLAB' as const,
      targetPlatform: 'GITHUB' as const,
      sourceUrl: 'https://gitlab.com/jane-smith/mobile-app',
      targetUrl: 'https://github.com/jane-smith/mobile-app',
      userId: normalUser.id,
      startedAt: new Date('2024-01-18T09:00:00Z'),
      estimatedTime: 60,
      totalFiles: 189,
      migratedFiles: 47,
      totalSize: 45230000n,
      migratedSize: 11307500n,
      errorCount: 5,
      warningCount: 1,
    },
    {
      title: 'Data Pipeline Migration',
      description: 'Moving Python ML pipeline with LFS files',
      status: 'PENDING' as const,
      type: 'LFS_SUPPORT' as const,
      progress: 0,
      sourceRepoId: createdRepos[3].id,
      sourcePlatform: 'GITHUB' as const,
      targetPlatform: 'GITLAB' as const,
      sourceUrl: 'https://github.com/techcorp/data-pipeline',
      targetUrl: 'https://gitlab.com/techcorp/data-pipeline',
      userId: adminUser.id,
      estimatedTime: 240,
      totalFiles: 678,
      migratedFiles: 0,
      totalSize: 523450000n,
      migratedSize: 0n,
      errorCount: 0,
      warningCount: 0,
    },
  ]

  const createdMigrations = []
  for (const migration of migrations) {
    const created = await prisma.migration.create({
      data: migration,
    })
    createdMigrations.push(created)
  }

  // Create migration logs
  const sampleLogs = [
    // Completed migration logs
    {
      migrationId: createdMigrations[0].id,
      level: 'INFO' as const,
      message: 'Migration started',
      component: 'system',
      timestamp: new Date('2024-01-15T10:00:00Z'),
    },
    {
      migrationId: createdMigrations[0].id,
      level: 'INFO' as const,
      message: 'Cloning source repository',
      component: 'git',
      timestamp: new Date('2024-01-15T10:05:00Z'),
    },
    {
      migrationId: createdMigrations[0].id,
      level: 'SUCCESS' as const,
      message: 'Repository cloned successfully',
      component: 'git',
      timestamp: new Date('2024-01-15T10:15:00Z'),
    },
    {
      migrationId: createdMigrations[0].id,
      level: 'WARNING' as const,
      message: 'Large file detected, consider using LFS',
      details: 'File: assets/video.mp4 (45MB)',
      component: 'files',
      timestamp: new Date('2024-01-15T10:45:00Z'),
    },
    {
      migrationId: createdMigrations[0].id,
      level: 'SUCCESS' as const,
      message: 'Migration completed successfully',
      component: 'system',
      timestamp: new Date('2024-01-15T11:30:00Z'),
    },
    // In-progress migration logs
    {
      migrationId: createdMigrations[1].id,
      level: 'INFO' as const,
      message: 'Migration started',
      component: 'system',
      timestamp: new Date('2024-01-20T14:00:00Z'),
    },
    {
      migrationId: createdMigrations[1].id,
      level: 'INFO' as const,
      message: 'Migrating pull requests',
      component: 'pull-requests',
      timestamp: new Date('2024-01-20T14:30:00Z'),
    },
    {
      migrationId: createdMigrations[1].id,
      level: 'ERROR' as const,
      message: 'Failed to migrate PR #23',
      details: 'Merge conflict detected in automated migration',
      component: 'pull-requests',
      timestamp: new Date('2024-01-20T15:15:00Z'),
    },
    // Failed migration logs
    {
      migrationId: createdMigrations[2].id,
      level: 'INFO' as const,
      message: 'Migration started',
      component: 'system',
      timestamp: new Date('2024-01-18T09:00:00Z'),
    },
    {
      migrationId: createdMigrations[2].id,
      level: 'ERROR' as const,
      message: 'Authentication failed',
      details: 'Invalid API token for GitLab repository',
      component: 'auth',
      timestamp: new Date('2024-01-18T09:15:00Z'),
    },
    {
      migrationId: createdMigrations[2].id,
      level: 'ERROR' as const,
      message: 'Migration failed',
      component: 'system',
      timestamp: new Date('2024-01-18T09:20:00Z'),
    },
  ]

  for (const log of sampleLogs) {
    await prisma.migrationLog.create({
      data: log,
    })
  }

  // Create user settings
  await prisma.userSettings.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      theme: 'dark',
      notifications: true,
      emailNotifications: true,
      autoRetryFailedMigrations: true,
      maxConcurrentMigrations: 5,
      preferredTargetPlatform: 'GITLAB',
      defaultMigrationType: 'FULL_MIRROR',
    },
  })

  await prisma.userSettings.upsert({
    where: { userId: normalUser.id },
    update: {},
    create: {
      userId: normalUser.id,
      theme: 'light',
      notifications: true,
      emailNotifications: false,
      autoRetryFailedMigrations: false,
      maxConcurrentMigrations: 2,
      preferredTargetPlatform: 'GITHUB',
      defaultMigrationType: 'CODE_ONLY',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: john@doe.com / johndoe123`)
  console.log(`👤 Normal user: jane@example.com / password123`)
  console.log(`📊 Created ${createdRepos.length} repositories`)
  console.log(`🔄 Created ${createdMigrations.length} migrations`)
  console.log(`📝 Created ${sampleLogs.length} migration logs`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
