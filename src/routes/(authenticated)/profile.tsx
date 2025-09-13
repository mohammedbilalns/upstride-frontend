import { createFileRoute } from '@tanstack/react-router'
import { 
  User,
  Settings,
  Mail,
  MapPin,
  Briefcase,
  Target,
  MessageSquare,
  Calendar,
  X,
  Plus,
  Edit,
  Save,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Profile data structure
interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    bio: string;
    location: string;
  };
  stats: {
    articlesRead: number;
    mentors: number;
    sessions: number;
  };
  careerGoals: {
    shortTerm: string;
    longTerm: string;
    skills: string[];
  };
  mentorshipPreferences: {
    communication: string;
    availability: string;
    interests: string[];
  };
}

// Dummy profile data
const dummyProfile: ProfileData = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    jobTitle: 'Software Developer',
    bio: 'Passionate software developer with 5 years of experience in web development. Currently focusing on React and Node.js technologies.',
    location: 'San Francisco, CA'
  },
  stats: {
    articlesRead: 12,
    mentors: 3,
    sessions: 8
  },
  careerGoals: {
    shortTerm: 'Improve my leadership skills and take on more responsibility in team projects.',
    longTerm: 'Transition to a technical leadership role within the next 3 years.',
    skills: ['Leadership', 'Project Management', 'System Architecture']
  },
  mentorshipPreferences: {
    communication: 'Video Calls',
    availability: 'Weekdays (9 AM - 5 PM)',
    interests: ['Leadership', 'Career Growth']
  }
};

// Communication options
const communicationOptions = [
  'Video Calls',
  'Phone Calls',
  'Chat Messages',
  'Email'
];

// Availability options
const availabilityOptions = [
  'Weekdays (9 AM - 5 PM)',
  'Weekdays (5 PM - 8 PM)',
  'Weekends',
  'Flexible'
];

// Interest options
const interestOptions = [
  'Leadership',
  'Career Growth',
  'Technical Skills',
  'Networking',
  'Work-Life Balance',
  'Entrepreneurship'
];

// Account settings options
const accountSettings = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'security', label: 'Security', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Mail },
  { id: 'privacy', label: 'Privacy', icon: MapPin },
  { id: 'billing', label: 'Billing', icon: Briefcase }
];

export const Route = createFileRoute('/(authenticated)/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 rounded-full p-2"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold mb-1">
                {dummyProfile.personalInfo.firstName} {dummyProfile.personalInfo.lastName}
              </h2>
              <p className="text-muted-foreground mb-6">{dummyProfile.personalInfo.jobTitle}</p>
              
              <div className="flex justify-center space-x-6 mb-6">
                <div className="text-center">
                  <p className="text-lg font-semibold">{dummyProfile.stats.articlesRead}</p>
                  <p className="text-xs text-muted-foreground">Articles Read</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{dummyProfile.stats.mentors}</p>
                  <p className="text-xs text-muted-foreground">Mentors</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{dummyProfile.stats.sessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </div>
              
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {accountSettings.map((setting) => {
                const Icon = setting.icon;
                return (
                  <button
                    key={setting.id}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{setting.label}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Content */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    defaultValue={dummyProfile.personalInfo.firstName}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    defaultValue={dummyProfile.personalInfo.lastName}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue={dummyProfile.personalInfo.email}
                />
              </div>
              
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  defaultValue={dummyProfile.personalInfo.jobTitle}
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={3}
                  defaultValue={dummyProfile.personalInfo.bio}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  defaultValue={dummyProfile.personalInfo.location}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Career Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Career Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shortTerm">Short-term Goals</Label>
                <Textarea 
                  id="shortTerm" 
                  rows={3}
                  defaultValue={dummyProfile.careerGoals.shortTerm}
                />
              </div>
              
              <div>
                <Label htmlFor="longTerm">Long-term Goals</Label>
                <Textarea 
                  id="longTerm" 
                  rows={3}
                  defaultValue={dummyProfile.careerGoals.longTerm}
                />
              </div>
              
              <div>
                <Label>Skills I Want to Develop</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dummyProfile.careerGoals.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center">
                      {skill}
                      <button className="ml-2 hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-8 px-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Goals
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Mentorship Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mentorship Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preferred Communication</Label>
                <Select defaultValue={dummyProfile.mentorshipPreferences.communication}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {communicationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Availability</Label>
                <Select defaultValue={dummyProfile.mentorshipPreferences.availability}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Areas of Interest</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        defaultChecked={dummyProfile.mentorshipPreferences.interests.includes(interest)}
                      />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
