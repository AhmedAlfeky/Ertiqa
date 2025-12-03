'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, X, Loader2, Video, Play } from 'lucide-react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { uploadVideoToBunny } from '@/features/instructor/video-upload-actions';
import { toast } from 'sonner';

// Extract video ID from Bunny.net URL
function extractBunnyVideoId(url: string): string | null {
  // Format: https://vz-{library}.b-cdn.net/{videoId}/play_720p.mp4
  const match = url.match(/\/([a-f0-9-]{36})\//);
  return match ? match[1] : null;
}

// Bunny.net Video Player Component
function BunnyVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const videoId = extractBunnyVideoId(videoUrl);
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '554357';

  if (!videoId) {
    // Fallback to regular video tag for non-Bunny URLs
    return (
      <video
        src={videoUrl}
        controls
        preload="metadata"
        className="w-full h-full object-contain"
      />
    );
  }

  // Use Bunny.net's iframe player
  return (
    <div className="relative w-full h-full">
      <iframe
        src={`https://player.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
        loading="lazy"
        className="border-0 absolute top-0 left-0 w-full h-full"
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
        allowFullScreen
      />
    </div>
  );
}

interface FormVideoUploadProps {
  name: string;
  label: string;
  description?: string;
  maxSizeMB?: number;
  required?: boolean;
  className?: string;
}

export default function FormVideoUpload({
  name,
  label,
  description,
  maxSizeMB = 500, // Default 500MB for videos
  required = false,
  className,
}: FormVideoUploadProps) {
  const form = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sync preview with form value (important for edit mode)
  useEffect(() => {
    const currentValue = form.getValues(name);
    console.log('📹 Video field value:', { name, currentValue, preview });
    if (currentValue && !preview) {
      console.log('✅ Setting preview from form value');
      setPreview(currentValue);
    }
  }, [name]); // Only run on mount and when name changes

  // Also watch the field value changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const videoUrl = value[name];
      if (videoUrl && videoUrl !== preview) {
        setPreview(videoUrl);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, name, preview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      form.setError(name, { message: 'Please upload a video file (MP4, WebM, OGG, or MOV)' });
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      form.setError(name, { message: `Video must be less than ${maxSizeMB}MB` });
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a FormData object for the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      // Simulate progress (Bunny.net doesn't provide progress callbacks in server actions)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Upload to Bunny.net via server action
      const result = await uploadVideoToBunny(file, file.name);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data) {
        // Update form value with video URL
        form.setValue(name, result.data.videoUrl, { shouldValidate: true });
        setPreview(result.data.videoUrl);
        form.clearErrors(name);
        toast.success('Video uploaded successfully');
      } else {
        form.setError(name, { message: result.error || 'Failed to upload video' });
        toast.error(result.error || 'Failed to upload video');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      form.setError(name, { message: error.message || 'Failed to upload video' });
      toast.error('An error occurred while uploading the video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    form.setValue(name, '', { shouldValidate: true });
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        console.log('🎬 Rendering video field:', { fieldValue: field.value, preview });
        
        return (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {(preview || field.value) ? (
                <div className="relative w-full">
                  <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg border overflow-hidden">
                    <BunnyVideoPlayer videoUrl={preview || field.value} />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={handleRemove}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    'hover:bg-muted/50',
                    uploading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <>
                        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          Uploading video... {uploadProgress}%
                        </p>
                        <Progress value={uploadProgress} className="w-64" />
                      </>
                    ) : (
                      <>
                        <Video className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, WebM, OGG, MOV up to {maxSizeMB}MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
        );
      }}
    />
  );
}



