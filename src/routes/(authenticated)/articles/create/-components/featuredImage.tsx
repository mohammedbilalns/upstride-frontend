import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Loader2 } from 'lucide-react'
import { useUploadMedia } from '@/hooks/useUploadMedia'
import type { CloudinaryResponse } from '@/types/cloudinaryResponse'

interface FeaturedImageUploadProps {
  onImageChange: (imageData: CloudinaryResponse | null) => void
  initialImage?: CloudinaryResponse 
  className?: string
}

export function FeaturedImageUpload({ onImageChange, initialImage, className }: FeaturedImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage?.secure_url || null)
  const { 
    handleUpload, 
    handleDelete, 
    uploadProgress, 
    isUploading, 
    fileDetails, 
    resetUpload,
    isDeleting 
  } = useUploadMedia()

  useEffect(() => {
    if (fileDetails.secure_url) {
      onImageChange(fileDetails)
    }
  }, [fileDetails, onImageChange])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      try {
        const tempPreviewUrl = URL.createObjectURL(file)
        setPreviewUrl(tempPreviewUrl)
        
        await handleUpload(file)
        
        URL.revokeObjectURL(tempPreviewUrl)
      } catch (error) {
        URL.revokeObjectURL(tempPreviewUrl)
        setPreviewUrl(null)
      }
    }
  }

  const handleRemoveImage = async () => {
    if (fileDetails.public_id) {
      await handleDelete()
    } else {
      resetUpload()
    }
    setPreviewUrl(null)
    onImageChange(null)
    
    // Reset the file input value to allow selecting the same file again
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Featured Image</CardTitle>
      </CardHeader>
      <CardContent>
        {previewUrl ? (
          // Preview state
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-md border">
              <img 
                src={previewUrl} 
                alt="Featured image preview" 
                className="w-full h-48 object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-3/4 space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-white text-xs text-center">{uploadProgress}%</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Change Image"
                )}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemoveImage}
                disabled={isUploading || isDeleting}
                className="px-3"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Upload state
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload an image
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </CardContent>
    </Card>
  )
}
