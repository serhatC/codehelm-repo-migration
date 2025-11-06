
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GitBranch, Eye, EyeOff, Loader2, Mail, Lock, Github } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [magicLinkEmail, setMagicLinkEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('password')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        })
        router.replace('/dashboard')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsMagicLinkLoading(true)

    try {
      const result = await signIn('email', {
        email: magicLinkEmail,
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Failed to send magic link. Please try again.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Magic Link Sent!',
          description: 'Check your email for the login link.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsMagicLinkLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'gitlab') => {
    setIsOAuthLoading(provider)
    try {
      await signIn(provider, {
        callbackUrl: '/dashboard'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to sign in with ${provider}. Please try again.`,
        variant: 'destructive',
      })
      setIsOAuthLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <GitBranch className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">RepoMigrate</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue managing your migrations
          </p>
        </div>

        <Card className="card-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* OAuth Options */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn('github')}
                disabled={isOAuthLoading !== null}
              >
                {isOAuthLoading === 'github' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Continue with GitHub
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn('gitlab')}
                disabled={isOAuthLoading !== null}
              >
                {isOAuthLoading === 'gitlab' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.405L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z"/>
                  </svg>
                )}
                Continue with GitLab
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                <span className="text-xs text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Tabs for Email/Password and Magic Link */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="password" onClick={() => setActiveTab('password')}>Password</TabsTrigger>
                <TabsTrigger value="magic-link" onClick={() => setActiveTab('magic-link')}>Magic Link</TabsTrigger>
              </TabsList>
              
              <TabsContent value="password">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-field">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="form-field">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="magic-link">
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="form-field">
                    <Label htmlFor="magic-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="magic-email"
                        type="email"
                        placeholder="john@example.com"
                        value={magicLinkEmail}
                        onChange={(e) => setMagicLinkEmail(e.target.value)}
                        required
                        disabled={isMagicLinkLoading}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      We&apos;ll send you a magic link to sign in without a password
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isMagicLinkLoading}>
                    {isMagicLinkLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Magic Link
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}
