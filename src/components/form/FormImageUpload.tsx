'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormImageUploadProps {
  name: string;
  label: string;
  description?: string;
  bucket: string;
  folder: string;
  maxSizeMB?: number;
  required?: boolean;
  className?: string;
}

export default function FormImageUpload({
  name,
  label,
  description,
  bucket,
  folder,
  maxSizeMB = 5,
  required = false,
  className,
}: FormImageUploadProps) {
  const form = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(form.getValues(name) || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      form.setError(name, { message: 'Please upload an image file' });
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      form.setError(name, { message: `Image must be less than ${maxSizeMB}MB` });
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Update form value and preview
      form.setValue(name, publicUrl, { shouldValidate: true });
      setPreview(publicUrl);
      form.clearErrors(name);
    } catch (error: any) {
      console.error('Upload error:', error);
      form.setError(name, { message: error.message || 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    form.setValue(name, '', { shouldValidate: true });
    setPreview(null);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemove}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    'hover:bg-muted/50',
                    uploading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    )}
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to {maxSizeMB}MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
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
      )}
    />
  );
}
