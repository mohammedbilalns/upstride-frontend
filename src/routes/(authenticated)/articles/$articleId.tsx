import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share, 
  Eye,
  Clock,
  Calendar,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { dummyArticles } from './-dummy-data'

// Define types
interface Comment {
  id: number;
  author: {
    name: string;
    imageUrl: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    title: string;
    imageUrl: string;
    isMentor: boolean;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  relatedArticles: {
    id: number;
    title: string;
    author: string;
    readTime: string;
  }[];
}

// Expanded dummy data for articles with full content
// Dummy comments data
const dummyComments: Comment[] = [
  {
    id: 1,
    author: {
      name: 'Alex Johnson',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    content: 'Great article! These strategies have really helped me improve my remote leadership skills. The point about focusing on outcomes rather than activity is particularly valuable.',
    timestamp: '2 hours ago',
    likes: 12
  },
  {
    id: 2,
    author: {
      name: 'Maria Garcia',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    content: 'I especially appreciate the emphasis on team well-being. It\'s so important to remember that remote work can be isolating and leaders need to be proactive about maintaining team connections.',
    timestamp: '5 hours ago',
    likes: 8
  },
  {
    id: 3,
    author: {
      name: 'James Wilson',
      imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    content: 'The communication protocols section is spot on. We\'ve implemented similar strategies in our team and it\'s made a huge difference in our productivity.',
    timestamp: '1 day ago',
    likes: 15
  }
];

export const Route = createFileRoute('/(authenticated)/articles/$articleId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { articleId } = Route.useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [newComment, setNewComment] = useState('')
  
  // Find the article by ID
  const article = dummyArticles.find(a => a.id === parseInt(articleId))
  
  // Check if the current user is the author
  const isAuthor = user && article && article.author.name === user.name
  
  const handleGoBack = () => {
    navigate({ to: '/articles' })
  }
  
  const handleLike = () => {
    setLiked(!liked)
  }
  
  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }
  
  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Here you would typically submit the comment to your API
      console.log('Submitting comment:', newComment)
      setNewComment('')
    }
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl ">
      {/* Back Button */}
      {/* <Button  */}
      {/*   variant="ghost"  */}
      {/*   className="mb-6" */}
      {/*   onClick={handleGoBack} */}
      {/* > */}
      {/*   <ArrowLeft className="h-4 w-4 mr-2" /> */}
      {/*   Back to Articles */}
      {/* </Button> */}
      
      {/* Article Header */}
      <Card className="mb-8">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.author.imageUrl} alt={article.author.name} />
                <AvatarFallback>{article.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{article.author.name}</p>
                  {article.author.isMentor && (
                    <Badge variant="outline" className="ml-2 text-xs">MENTOR</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{article.author.title}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Article Content */}
          <div className="prose prose-gray max-w-none mb-8">
            <div className="whitespace-pre-wrap">{article.content}</div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          
          {/* Engagement Metrics */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.views.toLocaleString()} views
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {article.comments} comments
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={liked ? "default" : "ghost"}
                size="sm"
                onClick={handleLike}
                className="flex cursor-pointer items-center"
              >
                <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                {liked ? article.likes + 1 : article.likes}
              </Button>
              <Button
                variant={bookmarked ? "default" : "ghost"}
                size="sm"
								className='cursor-pointer'
                onClick={handleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button className='cursor-pointer' variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className='cursor-pointer'>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate({ to: `/articles/edit/${article.id}` })}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Article
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Comments ({dummyComments.length})</h2>
        </CardHeader>
        <CardContent>
          {/* Add Comment */}
          <div className="mb-6">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
            />
            <Button onClick={handleSubmitComment} className='cursor-pointer' disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
          
          <Separator className="mb-6" />
          
          {/* Comments List */}
          <div className="space-y-6">
            {dummyComments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.imageUrl} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{comment.author.name}</p>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm mb-2">{comment.content}</p>
                  <Button variant="ghost" size="sm" className="cursor-pointer text-xs">
                    <Heart className="h-3 w-3 mr-1" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Related Articles */}
      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Related Articles</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {article.relatedArticles.map((relatedArticle) => (
              <div key={relatedArticle.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate({ to: `/articles/${relatedArticle.id}` })}>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{relatedArticle.title}</h3>
                  <p className="text-sm text-muted-foreground">by {relatedArticle.author} • {relatedArticle.readTime}</p>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
