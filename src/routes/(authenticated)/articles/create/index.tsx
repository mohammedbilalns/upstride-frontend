import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  ArrowLeft, 
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import PublishInfo from './-components/publishInfo'
import TagSelector from './-components/tagSelector'
import RichTextEditor from '@/components/rich-text-editor'
import { FeaturedImageUpload } from './-components/featuredImage'
import { useState } from 'react'
import type { CloudinaryResponse } from '@/types/cloudinaryResponse'

export const Route = createFileRoute('/(authenticated)/articles/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [featuredImage, setFeaturedImage] = useState<CloudinaryResponse | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }
  
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  const handleGoBack = () => {
    navigate({ to: '/articles' })
  }
  
  const saveArticle = async () => {
    setIsSaving(true)
    
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const articleData = {
          title,
          excerpt,
          content,
          tags,
          featuredImage: featuredImage ? {
            url: featuredImage.secure_url,
            publicId: featuredImage.public_id,
            resourceType: featuredImage.resuource_type,
          } : null
        }

        console.log("Article data to be saved:", articleData)

        setIsSaving(false)
        resolve(true)
      }, 1500)
    })
  }
  
  const handleSave = async () => {
    const success = await saveArticle()
    if (success) {
      navigate({ to: '/articles' })
    }
  }
  
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
                {(
                  <div className="h-full border rounded-md overflow-hidden flex flex-col">
                    <RichTextEditor content={content} onChange={handleContentChange} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col space-y-6">
          {/* Featured Image */}
          <FeaturedImageUpload 
            onImageChange={setFeaturedImage} 
          />
          
          {/* Tags */}
          <TagSelector 
            tags={tags}  
            addTag={addTag} 
            removeTag={removeTag} 
            newTag={newTag} 
            setNewTag={setNewTag} 
          />

          <PublishInfo handleSave={handleSave} isSaving={isSaving} /> 
        </div>
      </div>
    </div>
  )
}
