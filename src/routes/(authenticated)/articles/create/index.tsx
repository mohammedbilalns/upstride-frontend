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
import { ArticleEditor } from '../-components/ArticleEditor'
import { useArticleEditor } from '../-hooks/useArticleEditor'
import PublishInfo from './-components/publishInfo'
import CategorySelector from './-components/categorySelector'
import TagSelector from './-components/tagSelector'

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
					<CategorySelector category={category} setCategory={setCategory} />

					{/* Tags */}
					<TagSelector tags={tags}  addTag={addTag} removeTag={removeTag} newTag={newTag} setNewTag={setNewTag} />

					<PublishInfo handleSave={handleSave} isSaving={isSaving} /> 
				</div>
			</div>
		</div>
	)
}
