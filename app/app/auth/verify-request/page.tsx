

'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GitBranch, Mail, ArrowLeft } from 'lucide-react'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <GitBranch className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">RepoMigrate</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground">
            A sign-in link has been sent to your email address
          </p>
        </div>

        <Card className="card-hover">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Magic Link Sent!</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent you a secure sign-in link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h3 className="font-semibold text-sm">Next steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Check your email inbox</li>
                <li>Click the sign-in link in the email</li>
                <li>You&apos;ll be automatically signed in</li>
              </ol>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <strong>Note:</strong> The link will expire in 24 hours for security reasons.
              </p>
              <p>
                If you don&apos;t see the email, please check your spam folder.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}
