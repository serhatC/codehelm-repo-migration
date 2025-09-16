
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number | bigint): string {
  const size = typeof bytes === 'bigint' ? Number(bytes) : bytes
  if (size === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  
  return parseFloat((size / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}d ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}y ago`
}

export function calculateProgress(total: number, completed: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function generateMigrationTitle(sourcePlatform: string, targetPlatform: string, repoName: string): string {
  return `Migrate ${repoName} from ${sourcePlatform} to ${targetPlatform}`
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function extractRepoInfo(url: string): { owner: string; repo: string; platform: string } | null {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    
    if (pathParts.length < 2) return null
    
    let platform = ''
    if (hostname.includes('github.com')) platform = 'GITHUB'
    else if (hostname.includes('gitlab.com')) platform = 'GITLAB'
    else if (hostname.includes('bitbucket.org')) platform = 'BITBUCKET'
    else return null
    
    return {
      owner: pathParts[0],
      repo: pathParts[1].replace('.git', ''),
      platform
    }
  } catch {
    return null
  }
}

export function getSuccessRate(completed: number, failed: number): number {
  const total = completed + failed
  if (total === 0) return 100
  return Math.round((completed / total) * 100)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))
