
export interface User {
  id: string
  name?: string | null
  email: string
  firstName?: string | null
  lastName?: string | null
  companyName?: string | null
  isPremium: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Repository {
  id: string
  name: string
  fullName: string
  url: string
  platform: Platform
  owner: string
  isPrivate: boolean
  description?: string | null
  language?: string | null
  stars: number
  forks: number
  size: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Migration {
  id: string
  title: string
  description?: string | null
  status: MigrationStatus
  type: MigrationType
  progress: number
  sourceRepoId: string
  targetRepoId?: string | null
  sourcePlatform: Platform
  targetPlatform: Platform
  sourceUrl: string
  targetUrl?: string | null
  userId: string
  startedAt?: Date | null
  completedAt?: Date | null
  estimatedTime?: number | null
  actualTime?: number | null
  totalFiles: number
  migratedFiles: number
  totalSize: bigint
  migratedSize: bigint
  errorCount: number
  warningCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MigrationLog {
  id: string
  migrationId: string
  level: LogLevel
  message: string
  details?: string | null
  component?: string | null
  timestamp: Date
}

export type Platform = 'GITHUB' | 'GITLAB' | 'BITBUCKET'

export type MigrationStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'PAUSED' 
  | 'CANCELLED'

export type MigrationType = 
  | 'CODE_ONLY'
  | 'WITH_TAGS'
  | 'WITH_PULL_REQUESTS'
  | 'FULL_MIRROR'
  | 'LFS_SUPPORT'

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'

export interface DashboardStats {
  totalMigrations: number
  completedMigrations: number
  inProgressMigrations: number
  failedMigrations: number
  totalRepositories: number
  dataTransferred: string
  successRate: number
}

export interface PlatformConfig {
  name: string
  icon: string
  color: string
  bgColor: string
  textColor: string
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  GITHUB: {
    name: 'GitHub',
    icon: 'github',
    color: '#24292e',
    bgColor: 'bg-gray-900',
    textColor: 'text-white'
  },
  GITLAB: {
    name: 'GitLab',
    icon: 'gitlab',
    color: '#fc6d26',
    bgColor: 'bg-orange-500',
    textColor: 'text-white'
  },
  BITBUCKET: {
    name: 'Bitbucket',
    icon: 'bitbucket',
    color: '#0052cc',
    bgColor: 'bg-blue-600',
    textColor: 'text-white'
  }
}

export const STATUS_COLORS: Record<MigrationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
  PAUSED: 'bg-gray-100 text-gray-800 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200'
}

export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  INFO: 'text-blue-600',
  WARNING: 'text-yellow-600',
  ERROR: 'text-red-600',
  SUCCESS: 'text-green-600'
}
