import { createFileRoute } from '@tanstack/react-router'
import { 
  Heart,
  MessageSquare,
  Bookmark,
  Eye,
  Filter,
  UserPlus,
  Book,
  Calendar,
  Clock,
  MessageCircle,
	Bell,
	Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Mentor {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
  isOnline: boolean;
}

interface Article {
  id: number;
  title: string;
  description: string;
  author: {
    name: string;
    imageUrl: string;
    isMentor: boolean;
  };
  publishedAt: string;
  likes: number;
  comments: number;
  views: string;
}

interface Session {
  id: number;
  mentorName: string;
  title: string;
  time: string;
  date: string;
  color: string;
}

interface RecommendedArticle {
  id: number;
  title: string;
  readTime: string;
  imageUrl: string;
}

interface QuickAction {
  id: number;
  title: string;
  icon: any;
}

// Dummy data for mentors
const dummyMentors: Mentor[] = [
  {
    id: 1,
    name: 'Sarah Williams',
    title: 'Leadership Coach',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    isOnline: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Tech Career Advisor',
    imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    isOnline: true
  },
  {
    id: 3,
    name: 'Emma Thompson',
    title: 'Personal Branding',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    isOnline: false
  }
];

// Dummy data for articles
const dummyArticles: Article[] = [
  {
    id: 1,
    title: '5 Strategies for Effective Remote Leadership',
    description: 'Leading remote teams requires different approaches than traditional in-person management. Here are five strategies I\'ve found most effective in my 10+ years of experience...',
    author: {
      name: 'Sarah Williams',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      isMentor: true
    },
    publishedAt: '2 hours ago',
    likes: 42,
    comments: 7,
    views: '1.2K'
  },
  {
    id: 2,
    title: 'Navigating Career Transitions in Tech',
    description: 'Changing roles within the tech industry can be challenging but rewarding. Here\'s how to make a smooth transition without losing momentum in your career growth...',
    author: {
      name: 'Michael Chen',
      imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
      isMentor: true
    },
    publishedAt: '1 day ago',
    likes: 87,
    comments: 15,
    views: '3.4K'
  },
  {
    id: 3,
    title: 'Building Your Personal Brand as a Professional',
    description: 'Your personal brand is how you market yourself to the world. Here are practical steps to build and maintain a strong professional brand that opens doors...',
    author: {
      name: 'Emma Thompson',
      imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      isMentor: true
    },
    publishedAt: '3 days ago',
    likes: 124,
    comments: 23,
    views: '5.7K'
  }
];

// Dummy data for sessions
const dummySessions: Session[] = [
  {
    id: 1,
    mentorName: 'Sarah Williams',
    title: 'Leadership Coaching',
    time: '2:00 PM - 3:00 PM',
    date: 'Today',
    color: 'border-l-blue-500'
  },
  {
    id: 2,
    mentorName: 'Michael Chen',
    title: 'Career Guidance',
    time: '11:00 AM - 12:00 PM',
    date: 'Tomorrow',
    color: 'border-l-green-500'
  }
];

// Dummy data for recommended articles
const dummyRecommendedArticles: RecommendedArticle[] = [
  {
    id: 1,
    title: 'Effective Communication in Remote Teams',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    title: 'Setting Career Goals That Actually Work',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    title: 'Networking Strategies for Introverts',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  }
];

// Dummy data for quick actions
const dummyQuickActions: QuickAction[] = [
  {
    id: 1,
    title: 'Request Mentorship',
    icon: UserPlus
  },
  {
    id: 2,
    title: 'Browse Resources',
    icon: Book
  },
  {
    id: 3,
    title: 'View Calendar',
    icon: Calendar
  }
];

export const Route = createFileRoute('/(authenticated)/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Find Mentors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Find Mentors</span>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search by expertise..." 
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-3">
                  {dummyMentors.map((mentor) => (
                    <div key={mentor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {mentor.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{mentor.name}</p>
                          <p className="text-xs text-muted-foreground">{mentor.title}</p>
                        </div>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  ))}
                </div>
                
                <Button variant="link" className="w-full">
                  View All Mentors
                </Button>
              </CardContent>
            </Card>
            
            {/* My Mentors */}
            <Card>
              <CardHeader>
                <CardTitle>My Mentors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dummyMentors.filter(m => m.isOnline).map((mentor) => (
                  <div key={mentor.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                          <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{mentor.name}</p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button variant="link" className="w-full">
                  View All Mentors
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Feed */}
          <div className="w-full lg:w-2/4 space-y-6">
            {dummyArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={article.author.imageUrl} alt={article.author.name} />
                      <AvatarFallback>{article.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">{article.author.name}</p>
                        {article.author.isMentor && (
                          <Badge variant="secondary" className="ml-2 text-xs">MENTOR</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{article.publishedAt}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-muted-foreground mb-4">{article.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <button className="flex items-center hover:text-primary transition-colors">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{article.likes}</span>
                      </button>
                      <button className="flex items-center hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{article.comments}</span>
                      </button>
                      <button className="flex items-center hover:text-primary transition-colors">
                        <Bookmark className="h-4 w-4 mr-1" />
                      </button>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Right Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dummySessions.map((session) => (
                  <div key={session.id} className={`p-3 rounded-lg bg-muted border-l-4 ${session.color}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{session.mentorName}</p>
                        <p className="text-xs text-muted-foreground">{session.title}</p>
                      </div>
                      <Badge variant="outline">{session.date}</Badge>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{session.time}</span>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      Join Session
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Recommended Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dummyRecommendedArticles.map((article) => (
                  <div key={article.id} className="flex items-start p-2 rounded-lg hover:bg-muted transition-colors">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="h-12 w-12 rounded object-cover mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.readTime}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dummyQuickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button key={action.id} variant="ghost" className="w-full justify-start">
                      <div className="bg-muted p-2 rounded-lg mr-3">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span>{action.title}</span>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3">
        <Button size="icon" className="rounded-full shadow-lg">
          <MessageCircle className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        <Button size="icon" variant="outline" className="rounded-full shadow-lg">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
