import { createFileRoute } from '@tanstack/react-router'
import { 
  Settings,
  Bell,
  UserCheck,
  CalendarCheck,
  MessageCircle,
  Book,
  Star,
  AlertTriangle,
  Check,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Notification {
  id: number;
  type: 'session' | 'mentorship' | 'comment' | 'article' | 'review' | 'canceled';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  actions?: { label: string; variant?: 'default' | 'outline' | 'ghost' | 'destructive' }[];
}

// Dummy data for notifications
const dummyNotifications: Notification[] = [
  {
    id: 1,
    type: 'session',
    title: 'Session Reminder',
    description: 'Your session with Sarah Williams starts in 30 minutes',
    time: '30 min ago',
    isRead: false,
    actions: [
      { label: 'Join Session', variant: 'default' },
      { label: 'Dismiss', variant: 'ghost' }
    ]
  },
  {
    id: 2,
    type: 'mentorship',
    title: 'New Mentor Connection',
    description: 'Michael Chen accepted your mentorship request',
    time: '2 hours ago',
    isRead: false,
    actions: [
      { label: 'Send Message', variant: 'default' },
      { label: 'View Profile', variant: 'ghost' }
    ]
  },
  {
    id: 3,
    type: 'comment',
    title: 'New Comment',
    description: 'Emma Thompson commented on your post: "Great insights on personal branding!"',
    time: '5 hours ago',
    isRead: true,
    actions: [
      { label: 'Reply', variant: 'default' },
      { label: 'View Post', variant: 'ghost' }
    ]
  },
  {
    id: 4,
    type: 'article',
    title: 'New Article Published',
    description: 'Sarah Williams published "5 Strategies for Effective Remote Leadership"',
    time: '1 day ago',
    isRead: true,
    actions: [
      { label: 'Read Article', variant: 'default' },
      { label: 'Save for Later', variant: 'ghost' }
    ]
  },
  {
    id: 5,
    type: 'review',
    title: 'Mentorship Review',
    description: 'Please rate your recent session with David Wilson',
    time: '2 days ago',
    isRead: true,
    actions: [
      { label: 'Leave Review', variant: 'default' },
      { label: 'Dismiss', variant: 'ghost' }
    ]
  },
  {
    id: 6,
    type: 'canceled',
    title: 'Session Canceled',
    description: 'Your session with Michael Chen scheduled for tomorrow has been canceled',
    time: '3 days ago',
    isRead: true,
    actions: [
      { label: 'Reschedule', variant: 'default' },
      { label: 'View Calendar', variant: 'ghost' }
    ]
  }
];

// Notification filter options
const filterOptions = [
  { type: 'all', label: 'All Notifications', count: 12 },
  { type: 'mentorship', label: 'Mentorship', count: 5 },
  { type: 'sessions', label: 'Sessions', count: 3 },
  { type: 'articles', label: 'Articles', count: 2 },
  { type: 'system', label: 'System', count: 2 }
];

// Notification settings
const notificationSettings = [
  { id: 'email', label: 'Email Notifications', enabled: true },
  { id: 'push', label: 'Push Notifications', enabled: true },
  { id: 'sms', label: 'SMS Notifications', enabled: false }
];

// Get icon and color based on notification type
const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'session':
      return { icon: CalendarCheck, color: 'text-blue-500', bgColor: 'bg-blue-100' };
    case 'mentorship':
      return { icon: UserCheck, color: 'text-green-500', bgColor: 'bg-green-100' };
    case 'comment':
      return { icon: MessageCircle, color: 'text-purple-500', bgColor: 'bg-purple-100' };
    case 'article':
      return { icon: Book, color: 'text-orange-500', bgColor: 'bg-orange-100' };
    case 'review':
      return { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
    case 'canceled':
      return { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-100' };
    default:
      return { icon: Bell, color: 'text-gray-500', bgColor: 'bg-gray-100' };
  }
};

// Toggle switch component
const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        enabled ? "bg-primary" : "bg-gray-200"
      )}
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
    >
      <span
        className={cn(
          "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      >
        <span
          className={cn(
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
            enabled ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in"
          )}
          aria-hidden="true"
        >
          <X className="h-3 w-3 text-gray-400" />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
            enabled ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out"
          )}
          aria-hidden="true"
        >
          <Check className="h-3 w-3 text-primary" />
        </span>
      </span>
    </button>
  );
};

export const Route = createFileRoute('/(authenticated)/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with your mentorship activities and platform updates.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Filter Notifications</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {filterOptions.map((filter) => (
                <button
                  key={filter.type}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <span>{filter.label}</span>
                  <Badge variant="secondary">{filter.count}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Notification Settings</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <span className="text-sm">{setting.label}</span>
                  <ToggleSwitch 
                    enabled={setting.enabled} 
                    onChange={() => {}} 
                  />
                </div>
              ))}
              <Button className="w-full mt-4">Save Settings</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Notifications List */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {dummyNotifications.map((notification) => {
              const { icon: Icon, color, bgColor } = getNotificationIcon(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "relative overflow-hidden transition-all",
                    !notification.isRead && "border-l-4 border-l-primary"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className={cn("p-2 rounded-full mr-3", bgColor)}>
                        <Icon className={cn("h-5 w-5", color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {notification.time}
                          </span>
                        </div>
                        
                        {notification.actions && (
                          <div className="flex space-x-2 mt-3">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant={action.variant || 'ghost'}
                                size="sm"
                                className="text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">Load More Notifications</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
