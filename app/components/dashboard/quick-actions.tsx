
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  GitBranch, 
  Plus, 
  History, 
  Settings, 
  Github, 
  GitlabIcon as Gitlab,
  Database as Bitbucket
} from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  const actions = [
    {
      title: 'New Migration',
      description: 'Start migrating a repository',
      icon: Plus,
      href: '/migrate',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'View History',
      description: 'See all your migrations',
      icon: History,
      href: '/history',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Connect Repository',
      description: 'Add a new repository',
      icon: GitBranch,
      href: '/repositories',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Settings',
      description: 'Manage your preferences',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ]

  const platforms = [
    {
      name: 'GitHub',
      icon: Github,
      description: 'Connect GitHub repositories',
      href: '/repositories?platform=github'
    },
    {
      name: 'GitLab',
      icon: Gitlab,
      description: 'Connect GitLab repositories',
      href: '/repositories?platform=gitlab'
    },
    {
      name: 'Bitbucket',
      icon: Bitbucket,
      description: 'Connect Bitbucket repositories',
      href: '/repositories?platform=bitbucket'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              asChild
            >
              <Link href={action.href}>
                <div className={`mr-3 rounded-md p-1.5 ${action.bgColor}`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Platform Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Shortcuts</CardTitle>
          <CardDescription>
            Quick access to platform-specific features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {platforms.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <Link href={platform.href}>
                <platform.icon className="mr-2 h-4 w-4" />
                {platform.name}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
