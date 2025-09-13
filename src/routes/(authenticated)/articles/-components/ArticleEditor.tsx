import { useEditor, EditorContent } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon,
  Image as ImageIcon,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { forwardRef } from 'react'

interface ArticleEditorProps {
  editor: any
  onImageUpload: (file: File) => Promise<string>
}

export const ArticleEditor = forwardRef<HTMLDivElement, ArticleEditorProps>(
  ({ editor, onImageUpload }, ref) => {
    if (!editor) {
      return null
    }

    const addImage = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const url = await onImageUpload(file)
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }
      }
      input.click()
    }

    const setLink = () => {
      const url = window.prompt('Enter the URL:')
      if (url === null) {
        return
      }
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const MenuBar = () => {
      return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b">
          <Toggle
            size="sm"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('code')}
            onPressedChange={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Toggle>
          <Separator orientation="vertical" className="h-6" />
          <Toggle
            size="sm"
            pressed={editor.isActive('bulletList')}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('orderedList')}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('blockquote')}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </Toggle>
          <Separator orientation="vertical" className="h-6" />
          <Button size="sm" variant="ghost" onClick={setLink}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={addImage}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return (
      <div ref={ref} className="border rounded-md overflow-hidden flex flex-col h-full">
        <MenuBar />
        <EditorContent
          editor={editor}
          className="flex-1 overflow-y-auto p-4 prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    )
  }
)

ArticleEditor.displayName = 'ArticleEditor'
