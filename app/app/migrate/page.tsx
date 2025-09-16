
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Github, 
  GitlabIcon as Gitlab, 
  Database as Bitbucket,
  ArrowRight,
  CheckCircle,
  Circle,
  Crown,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { cn, validateUrl, extractRepoInfo, generateMigrationTitle } from '@/lib/utils'

const platforms = [
  { value: 'GITHUB', label: 'GitHub', icon: Github, color: 'text-gray-900' },
  { value: 'GITLAB', label: 'GitLab', icon: Gitlab, color: 'text-orange-500' },
  { value: 'BITBUCKET', label: 'Bitbucket', icon: Bitbucket, color: 'text-blue-600' }
]

const migrationTypes = [
  {
    value: 'CODE_ONLY',
    label: 'Code Only',
    description: 'Migrate source code and commit history',
    free: true
  },
  {
    value: 'WITH_TAGS',
    label: 'Code + Tags',
    description: 'Include all tags and releases',
    free: true
  },
  {
    value: 'WITH_PULL_REQUESTS',
    label: 'Code + Pull Requests',
    description: 'Include PRs, issues, and discussions',
    free: true
  },
  {
    value: 'FULL_MIRROR',
    label: 'Full Mirror',
    description: 'Complete mirror with all metadata',
    free: false
  },
  {
    value: 'LFS_SUPPORT',
    label: 'LFS Support',
    description: 'Include Git LFS files (Premium)',
    free: false
  }
]

const steps = [
  { id: 1, title: 'Source Repository', description: 'Select source platform and repository' },
  { id: 2, title: 'Destination', description: 'Choose target platform and settings' },
  { id: 3, title: 'Migration Options', description: 'Configure what to migrate' },
  { id: 4, title: 'Review & Start', description: 'Review settings and start migration' }
]

export default function MigrationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    sourceUrl: '',
    sourcePlatform: '',
    targetUrl: '',
    targetPlatform: '',
    migrationType: 'CODE_ONLY',
    title: '',
    description: '',
    preserveHistory: true,
    includeBranches: true,
    includeTags: false,
    includePRs: false,
    includeIssues: false
  })

  const { toast } = useToast()
  const router = useRouter()

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.sourceUrl) {
          toast({
            title: 'Source URL Required',
            description: 'Please enter a valid repository URL.',
            variant: 'destructive'
          })
          return false
        }
        if (!validateUrl(formData.sourceUrl)) {
          toast({
            title: 'Invalid URL',
            description: 'Please enter a valid repository URL.',
            variant: 'destructive'
          })
          return false
        }
        return true
      case 2:
        if (!formData.targetPlatform) {
          toast({
            title: 'Target Platform Required',
            description: 'Please select a target platform.',
            variant: 'destructive'
          })
          return false
        }
        return true
      case 3:
        return true
      default:
        return true
    }
  }

  const handleSourceUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, sourceUrl: url }))
    
    if (url && validateUrl(url)) {
      const repoInfo = extractRepoInfo(url)
      if (repoInfo) {
        setFormData(prev => ({
          ...prev,
          sourcePlatform: repoInfo.platform,
          title: prev.title || generateMigrationTitle(repoInfo.platform, prev.targetPlatform, repoInfo.repo)
        }))
      }
    }
  }

  const handleTargetPlatformChange = (platform: string) => {
    setFormData(prev => {
      const repoInfo = prev.sourceUrl ? extractRepoInfo(prev.sourceUrl) : null
      return {
        ...prev,
        targetPlatform: platform,
        title: repoInfo ? generateMigrationTitle(prev.sourcePlatform, platform, repoInfo.repo) : prev.title
      }
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/migrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          sourceUrl: formData.sourceUrl,
          targetUrl: formData.targetUrl,
          sourcePlatform: formData.sourcePlatform,
          targetPlatform: formData.targetPlatform,
          type: formData.migrationType
        })
      })

      if (response.ok) {
        const { migration } = await response.json()
        toast({
          title: 'Migration Created',
          description: 'Your migration has been queued and will start shortly.'
        })
        router.push(`/migrations/${migration.id}`)
      } else {
        const error = await response.json()
        toast({
          title: 'Migration Failed',
          description: error.error || 'Failed to create migration.',
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
      setIsLoading(false)
    }
  }

  const getStepIcon = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (stepNumber === currentStep) {
      return <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
      </div>
    } else {
      return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="container-responsive py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Migration</h1>
          <p className="text-muted-foreground">
            Follow the steps below to migrate your repository between platforms
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center space-x-2",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <div className="flex items-center space-x-2">
                  {getStepIcon(step.id)}
                  <div className="text-left">
                    <div className={cn(
                      "text-sm font-medium",
                      step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={cn(
                      "h-0.5 w-full",
                      step.id < currentStep ? "bg-green-600" : "bg-muted"
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sourceUrl">Repository URL</Label>
                  <Input
                    id="sourceUrl"
                    placeholder="https://github.com/user/repo"
                    value={formData.sourceUrl}
                    onChange={(e) => handleSourceUrlChange(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the full URL of the repository you want to migrate
                  </p>
                </div>

                {formData.sourcePlatform && (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center space-x-2">
                      {React.createElement(
                        platforms.find(p => p.value === formData.sourcePlatform)?.icon || Github,
                        { className: "h-5 w-5" }
                      )}
                      <span className="font-medium">
                        {platforms.find(p => p.value === formData.sourcePlatform)?.label} Repository Detected
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Source platform automatically detected from URL
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Target Platform</Label>
                  <Select value={formData.targetPlatform} onValueChange={handleTargetPlatformChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.filter(p => p.value !== formData.sourcePlatform).map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center space-x-2">
                            <platform.icon className={cn("h-4 w-4", platform.color)} />
                            <span>{platform.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetUrl">Target Repository URL (Optional)</Label>
                  <Input
                    id="targetUrl"
                    placeholder="https://gitlab.com/user/repo"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave empty to auto-generate or specify exact target URL
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Migration Type</Label>
                  <div className="grid gap-3 mt-2">
                    {migrationTypes.map(type => (
                      <div
                        key={type.value}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          formData.migrationType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50",
                          !type.free && "opacity-60"
                        )}
                        onClick={() => {
                          if (type.free) {
                            setFormData(prev => ({ ...prev, migrationType: type.value }))
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2",
                              formData.migrationType === type.value
                                ? "border-primary bg-primary"
                                : "border-muted"
                            )}>
                              {formData.migrationType === type.value && (
                                <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium flex items-center space-x-2">
                                <span>{type.label}</span>
                                {!type.free && <Crown className="h-4 w-4 text-yellow-600" />}
                              </div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                            </div>
                          </div>
                          {!type.free && (
                            <Badge variant="secondary">Premium</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Additional Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="preserveHistory"
                        checked={formData.preserveHistory}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, preserveHistory: !!checked }))
                        }
                      />
                      <Label htmlFor="preserveHistory">Preserve commit history</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeBranches"
                        checked={formData.includeBranches}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, includeBranches: !!checked }))
                        }
                      />
                      <Label htmlFor="includeBranches">Include all branches</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Migration Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of this migration"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h3 className="font-medium mb-3">Migration Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="font-medium">{formData.sourceUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span className="font-medium">
                        {platforms.find(p => p.value === formData.targetPlatform)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">
                        {migrationTypes.find(t => t.value === formData.migrationType)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Ready to start migration</p>
                    <p className="text-amber-700">
                      This process may take some time depending on repository size.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Migration...
                  </>
                ) : (
                  'Start Migration'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
