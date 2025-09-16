
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown,
  Check,
  X,
  Zap,
  Shield,
  Gauge,
  Database,
  Clock,
  Users,
  Headphones,
  Star,
  GitBranch,
  FileText,
  Settings
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Database,
    title: 'LFS Support',
    description: 'Migrate repositories with Git Large File Storage (LFS) support',
    free: false,
    premium: true
  },
  {
    icon: Zap,
    title: 'Bulk Migrations',
    description: 'Migrate multiple repositories simultaneously',
    free: false,
    premium: true
  },
  {
    icon: Gauge,
    title: 'Priority Processing',
    description: 'Your migrations get processed faster with premium queue',
    free: false,
    premium: true
  },
  {
    icon: Shield,
    title: 'Advanced Security',
    description: 'Enhanced security features and audit logs',
    free: false,
    premium: true
  },
  {
    icon: Clock,
    title: 'Extended History',
    description: 'Keep migration logs and history for unlimited time',
    free: false,
    premium: true
  },
  {
    icon: Headphones,
    title: 'Priority Support',
    description: '24/7 premium support with guaranteed response times',
    free: false,
    premium: true
  },
  {
    icon: GitBranch,
    title: 'Basic Migrations',
    description: 'Code, tags, and pull request migrations',
    free: true,
    premium: true
  },
  {
    icon: FileText,
    title: 'Migration Logs',
    description: 'Basic migration tracking and logs (30 days)',
    free: true,
    premium: true
  },
  {
    icon: Users,
    title: 'Public Repositories',
    description: 'Migrate public repositories between platforms',
    free: true,
    premium: true
  }
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for personal projects and small migrations',
    features: [
      'Up to 5 migrations per month',
      'Code + Tags + PRs migration',
      'Public repositories only',
      '30-day migration history',
      'Community support',
      'Standard processing speed'
    ],
    limitations: [
      'No LFS support',
      'No bulk migrations',
      'No private repositories',
      'Limited history retention'
    ],
    current: false
  },
  {
    name: 'Premium',
    price: '$19',
    period: '/month',
    description: 'For professional developers and teams',
    features: [
      'Unlimited migrations',
      'All migration types including LFS',
      'Private & public repositories',
      'Bulk migration support',
      'Priority processing (3x faster)',
      'Unlimited history retention',
      'Advanced security features',
      '24/7 priority support',
      'Custom migration scripts',
      'API access'
    ],
    popular: true,
    current: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs',
    features: [
      'Everything in Premium',
      'Dedicated migration servers',
      'Custom integrations',
      'Advanced audit logs',
      'SSO integration',
      'Dedicated account manager',
      'Custom SLA agreements',
      'On-premise deployment options'
    ],
    enterprise: true,
    current: false
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'TechCorp',
    avatar: '👩‍💻',
    quote: 'RepoMigrate saved us weeks of manual work. The LFS support was crucial for our ML repositories.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    company: 'StartupXYZ',
    avatar: '👨‍💻',
    quote: 'Seamless migration from Bitbucket to GitHub. Zero data loss and excellent support.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    company: 'DevStudio',
    avatar: '👩‍🎨',
    quote: 'The bulk migration feature helped us move 50+ repositories in a single day.',
    rating: 5
  }
]

export default function PremiumPage() {
  return (
    <div className="container-responsive py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Unlock the Full Power of{' '}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Repository Migration
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upgrade to Premium for advanced features, faster processing, and unlimited migrations.
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Features Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Feature</h3>
                  <div className="space-y-4">
                    {features.map((feature) => (
                      <div key={feature.title} className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{feature.title}</div>
                          <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 text-center">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">Free</h3>
                    <p className="text-sm text-muted-foreground">Personal use</p>
                  </div>
                  <div className="space-y-4">
                    {features.map((feature) => (
                      <div key={feature.title} className="h-12 flex items-center justify-center">
                        {feature.free ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 text-center bg-gradient-to-b from-primary/5 to-primary/10">
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold text-lg">Premium</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Professional use</p>
                  </div>
                  <div className="space-y-4">
                    {features.map((feature) => (
                      <div key={feature.title} className="h-12 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-center">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation) => (
                      <div key={limitation} className="flex items-center space-x-2">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-primary/90' 
                        : plan.enterprise 
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700'
                          : ''
                    }`}
                    variant={plan.name === 'Free' ? 'outline' : 'default'}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 
                     plan.enterprise ? 'Contact Sales' :
                     plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-sm italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens to my migrations if I downgrade?</h3>
              <p className="text-sm text-muted-foreground">
                Your existing migrations will remain accessible, but new migrations will be subject to Free plan limitations. Migration history older than 30 days may be archived.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day money-back guarantee for Premium subscriptions. If you're not satisfied, contact support for a full refund.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial for Premium?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 7-day free trial of Premium features for new users. No credit card required to start your trial.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border">
          <h2 className="text-2xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of developers who trust RepoMigrate Premium for their critical repository migrations.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90">
              <Crown className="mr-2 h-4 w-4" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                Continue with Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
