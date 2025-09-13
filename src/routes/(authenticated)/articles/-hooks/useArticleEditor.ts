import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useState } from 'react'

export const useArticleEditor = () => {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false,
        code: {
          HTMLAttributes: {
            class: 'bg-muted px-1 py-0.5 rounded text-sm font-mono',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic',
          },
        },
        horizontalRule: false,
        dropcursor: {
          color: '#hsl(var(--primary))',
          width: 3,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
    ],
    content: '',
    immediatelyRender: false,
  })

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    // Simulate image upload - replace with actual upload logic
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  const saveArticle = async (): Promise<boolean> => {
    if (!title.trim() || !category || !editor?.getHTML()) {
      alert('Please fill in all required fields')
      return false
    }

    setIsSaving(true)
    
    try {
      // Simulate API call - replace with actual save logic
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const articleData = {
        title,
        excerpt,
        category,
        content: editor.getHTML(),
        tags,
        publishedAt: new Date().toISOString(),
      }
      
      console.log('Saving article:', articleData)
      
      
      
      return true
    } catch (error) {
      console.error('Error saving article:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return {
    title,
    setTitle,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    content: editor?.getHTML() || '',
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
    handleImageUpload,
  }
}
