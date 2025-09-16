
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { 
  GitBranch, 
  LayoutDashboard, 
  History, 
  Settings, 
  Crown,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Migration', href: '/migrate', icon: GitBranch },
  { name: 'History', href: '/history', icon: History },
  { name: 'Premium', href: '/premium', icon: Crown },
]

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession() || {}
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  if (!session) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GitBranch className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">RepoMigrate</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <GitBranch className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">RepoMigrate</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-accent">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                {session.user?.name || session.user?.email}
              </span>
              {session.user?.isPremium && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-2 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center space-x-3 px-3 py-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-base font-medium">
                  {session.user?.name || session.user?.email}
                </span>
                {session.user?.isPremium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 h-auto text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
