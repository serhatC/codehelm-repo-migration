
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Github, 
  GitlabIcon as Gitlab, 
  Database as Bitbucket,
  Plus,
  Search,
  Star,
  GitFork,
  Lock,
  Globe,
  Calendar,
  Code,
  Loader2,
  ExternalLink,
  GitBranch
} from 'lucide-react'
import Link from 'next/link'
import { getTimeAgo, formatBytes } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const platformIcons = {
  GITHUB: Github,
  GITLAB: Gitlab,
  BITBUCKET: Bitbucket
}

const platformColors = {
  GITHUB: 'text-gray-900',
  GITLAB: 'text-orange-500',
  BITBUCKET: 'text-blue-600'
}

const languageColors: { [key: string]: string } = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-orange-600',
  PHP: 'bg-purple-500',
  Ruby: 'bg-red-600',
  'C++': 'bg-blue-600',
  'C#': 'bg-green-600',
}

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingRepo, setAddingRepo] = useState(false)
  const [newRepoUrl, setNewRepoUrl] = useState('')
  const [filters, setFilters] = useState({
    platform: 'all',
    search: ''
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchRepositories()
  }, [filters])

  const fetchRepositories = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.platform !== 'all') params.set('platform', filters.platform)
      
      const response = await fetch(`/api/repositories?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRepositories(data.repositories || [])
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRepository = async () => {
    if (!newRepoUrl) {
      toast({
        title: 'URL Required',
        description: 'Please enter a repository URL.',
        variant: 'destructive'
      })
      return
    }

    setAddingRepo(true)
    try {
      const response = await fetch('/api/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: newRepoUrl })
      })

      if (response.ok) {
        toast({
          title: 'Repository Added',
          description: 'Repository has been successfully connected.'
        })
        setNewRepoUrl('')
        fetchRepositories()
      } else {
        const error = await response.json()
        toast({
          title: 'Failed to Add Repository',
          description: error.error || 'Failed to connect repository.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      })
    } finally {
      setAddingRepo(false)
    }
  }

  const filteredRepositories = repositories.filter((repo: any) =>
    repo.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    repo.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
    repo.owner.toLowerCase().includes(filters.search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
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
            <h1 className="text-3xl font-bold mb-2">Connected Repositories</h1>
            <p className="text-muted-foreground">
              Manage your connected repositories across platforms
            </p>
          </div>
        </div>

        {/* Add Repository */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Connect New Repository</span>
            </CardTitle>
            <CardDescription>
              Add a repository from GitHub, GitLab, or Bitbucket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="https://github.com/user/repository"
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddRepository} disabled={addingRepo}>
                {addingRepo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search repositories..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
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

        {/* Repository Grid */}
        {filteredRepositories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <GitBranch className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {repositories.length === 0 ? 'No repositories connected' : 'No repositories found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {repositories.length === 0 
                  ? 'Connect your first repository to get started with migrations.'
                  : 'Try adjusting your search or filters to find repositories.'
                }
              </p>
              {repositories.length === 0 && (
                <Button>
                  Connect Repository
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepositories.map((repo: any) => {
              const PlatformIcon = platformIcons[repo.platform as keyof typeof platformIcons]
              const platformColor = platformColors[repo.platform as keyof typeof platformColors]
              const languageColor = languageColors[repo.language || ''] || 'bg-gray-500'

              return (
                <Card key={repo.id} className="repo-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <PlatformIcon className={`h-5 w-5 ${platformColor}`} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{repo.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{repo.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {repo.isPrivate ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {repo.description || 'No description available'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        {repo.language && (
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded-full ${languageColor}`} />
                            <span>{repo.language}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{repo.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitFork className="h-3 w-3" />
                          <span>{repo.forks}</span>
                        </div>
                      </div>
                    </div>

                    {/* Repository Size and Last Updated */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatBytes(repo.size * 1024)}</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {getTimeAgo(new Date(repo.updatedAt))}</span>
                      </span>
                    </div>

                    {/* Migration Status */}
                    {(repo.lastSourceMigration || repo.lastTargetMigration) && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Last Migration</span>
                          <Badge 
                            variant="outline" 
                            className={
                              repo.lastSourceMigration?.status === 'COMPLETED' ? 'border-green-200 text-green-700' :
                              repo.lastSourceMigration?.status === 'FAILED' ? 'border-red-200 text-red-700' :
                              'border-blue-200 text-blue-700'
                            }
                          >
                            {repo.lastSourceMigration?.status || repo.lastTargetMigration?.status || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/migrate?source=${encodeURIComponent(repo.url)}`}>
                          <GitBranch className="mr-1 h-3 w-3" />
                          Migrate
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={repo.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Statistics */}
        {repositories.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold mb-1">{repositories.length}</div>
                <div className="text-sm text-muted-foreground">Total Repositories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold mb-1">
                  {repositories.filter((r: any) => !r.isPrivate).length}
                </div>
                <div className="text-sm text-muted-foreground">Public Repositories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold mb-1">
                  {new Set(repositories.map((r: any) => r.platform)).size}
                </div>
                <div className="text-sm text-muted-foreground">Platforms</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
