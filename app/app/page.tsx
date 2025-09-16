
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  GitBranch, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Github,
  GitlabIcon as Gitlab,
  Database,
  Lock,
  BarChart3,
  Users
} from 'lucide-react'

const features = [
  {
    icon: GitBranch,
    title: 'Multi-Platform Support',
    description: 'Seamlessly migrate between GitHub, GitLab, and Bitbucket with full compatibility.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Bank-grade security with encrypted transfers and comprehensive backup systems.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized migration engine that processes repositories up to 10x faster.'
  },
  {
    icon: Clock,
    title: 'Real-time Tracking',
    description: 'Monitor your migration progress with detailed logs and live updates.'
  },
  {
    icon: CheckCircle,
    title: 'Zero Data Loss',
    description: 'Complete migration including code, history, issues, and pull requests.'
  },
  {
    icon: BarChart3,
    title: 'Migration Analytics',
    description: 'Detailed insights and reports on your migration performance and success.'
  }
]

const stats = [
  { label: 'Repositories Migrated', value: '50,000+' },
  { label: 'Success Rate', value: '99.9%' },
  { label: 'Data Transferred', value: '2.5TB+' },
  { label: 'Happy Customers', value: '5,000+' }
]

const platforms = [
  { name: 'GitHub', icon: Github, color: 'text-gray-900' },
  { name: 'GitLab', icon: Gitlab, color: 'text-orange-500' },
  { name: 'Bitbucket', icon: Database, color: 'text-blue-600' }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container-responsive relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6" variant="secondary">
              <Lock className="mr-1 h-3 w-3" />
              Enterprise-grade Security
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Migrate Your Repositories with{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Seamlessly move your code between GitHub, GitLab, and Bitbucket. 
              Preserve your entire history, issues, and pull requests with zero downtime.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="gradient-button">
                <Link href="/auth/signup">
                  Start Free Migration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">View Demo</Link>
              </Button>
            </div>
          </div>
          
          {/* Platform Icons */}
          <div className="mt-16 flex justify-center items-center gap-8">
            <div className="flex items-center gap-6 opacity-60">
              {platforms.map((platform, index) => (
                <div key={platform.name} className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full border bg-background p-4 shadow-sm">
                      <platform.icon className={`h-8 w-8 ${platform.color}`} />
                    </div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  {index < platforms.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-16">
        <div className="container-responsive">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything You Need for{' '}
              <span className="text-primary">Perfect Migration</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform handles the complexity so you can focus on what matters most - your code.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover">
                <CardHeader>
                  <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-responsive text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Migrate Your Repositories?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Join thousands of developers who trust RepoMigrate for their repository migrations.
            Start your first migration in minutes.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">
                <Users className="mr-2 h-4 w-4" />
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/premium">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container-responsive">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-6 w-6 text-primary" />
              <span className="font-semibold">RepoMigrate</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 RepoMigrate. Built with security and reliability in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
