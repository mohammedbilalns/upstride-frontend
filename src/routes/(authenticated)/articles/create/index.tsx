import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  ArrowLeft, 
  Save, 
  Eye,
  X,
  FileText,
  Tag,
  Calendar,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArticleEditor } from '../-components/ArticleEditor'
import { useArticleEditor } from '../-hooks/useArticleEditor'

const categories = [
  "Leadership",
  "Career Growth",
  "Personal Branding",
  "Communication",
  "Technology",
  "Networking",
  "Entrepreneurship",
  "Productivity",
  "Work-Life Balance",
  "Innovation"
]

export const Route = createFileRoute('/(authenticated)/articles/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const {
    title,
    setTitle,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    content,
    editor,
    tags,
    addTag,
    removeTag,
    newTag,
    setNewTag,
    isSaving,
    isPreview,
    setIsPreview,
    saveArticle,
    handleImageUpload
  } = useArticleEditor()

  const handleGoBack = () => {
    navigate({ to: '/articles' })
  }

  const handleSave = async () => {
    const success = await saveArticle()
    if (success) {
      navigate({ to: '/articles' })
    }
  }

  // const handlePreview = () => {
  //   setIsPreview(!isPreview)
  // }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button className='cursor-pointer' variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Create New Article</h1>
        </div>
        {/* <div className="flex items-center space-x-2"> */}
        {/*   <Button variant="outline" className='cursor-pointer' onClick={handlePreview}> */}
        {/*     <Eye className="h-4 w-4 mr-2" /> */}
        {/*     {isPreview ? 'Edit' : 'Preview'} */}
        {/*   </Button> */}
        {/*   <Button className='cursor-pointer' onClick={handleSave} disabled={isSaving}> */}
        {/*     <Save className="h-4 w-4 mr-2" /> */}
        {/*     {isSaving ? 'Saving...' : 'Publish'} */}
        {/*   </Button> */}
        {/* </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Article Content
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Title Input */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg mt-2"
                />
              </div>
              
              {/* Excerpt Input */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
									className='mt-2'
                  placeholder="Write a brief excerpt for your article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                />
              </div>
              
              {/* Editor */}
              <div className="flex-1 min-h-[400px]">
                {isPreview ? (
                  <div className="prose prose-gray max-w-none h-full p-4 border rounded-md overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                ) : (
                  <div className="h-full border rounded-md overflow-hidden flex flex-col">
                    <ArticleEditor
                      editor={editor}
                      onImageUpload={handleImageUpload}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="flex flex-col space-y-6">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center">
                    {tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTag.trim()) {
                      addTag(newTag.trim())
                      setNewTag('')
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newTag.trim()) {
                      addTag(newTag.trim())
                      setNewTag('')
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Publish Info */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span>Published as Alex Johnson</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Immediately on publish</span>
              </div>
              <Separator />
              <div className="mt-auto">
                <Button className="w-full cursor-pointer" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Publish Article'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
