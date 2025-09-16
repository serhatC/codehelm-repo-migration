
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Crown
} from 'lucide-react'

export default async function SettingsPage() {
  const session = await getAuth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="container-responsive py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account preferences and migration settings.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-muted-foreground">{session.user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <form action="#" method="POST">
                  <Button variant="outline" type="submit">Edit Profile</Button>
                </form>
                {session.user.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium User
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications about your migrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium text-sm">Migration Alerts</div>
                    <div className="text-xs text-muted-foreground">Get notified when migrations start, complete, or fail</div>
                  </div>
                  <form action="#" method="POST">
                    <Button variant="outline" size="sm" type="submit">Configure</Button>
                  </form>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium text-sm">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">Receive email updates for important events</div>
                  </div>
                  <form action="#" method="POST">
                    <Button variant="outline" size="sm" type="submit">Configure</Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Privacy</span>
              </CardTitle>
              <CardDescription>
                Manage your account security and data privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium text-sm">Change Password</div>
                    <div className="text-xs text-muted-foreground">Update your account password</div>
                  </div>
                  <form action="#" method="POST">
                    <Button variant="outline" size="sm" type="submit">Change</Button>
                  </form>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium text-sm">Two-Factor Authentication</div>
                    <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
                  </div>
                  <form action="#" method="POST">
                    <Button variant="outline" size="sm" type="submit">Enable</Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <div className="font-medium text-sm">Theme Preference</div>
                  <div className="text-xs text-muted-foreground">Choose between light and dark mode</div>
                </div>
                <form action="#" method="POST">
                  <Button variant="outline" size="sm" type="submit">Customize</Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                <div>
                  <div className="font-medium text-sm text-red-800">Delete Account</div>
                  <div className="text-xs text-red-600">Permanently delete your account and all data</div>
                </div>
                <form action="#" method="POST">
                  <Button variant="destructive" size="sm" type="submit">Delete</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
