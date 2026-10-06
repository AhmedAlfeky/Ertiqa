'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  disabled,
  className,
}: ImageUploadProps) {
  const t = useTranslations('instructor');
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert(t('pleaseUploadValidImage'));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('fileSizeMustBeLess'));
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    onUploadStart?.();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { uploadCourseImage } = await import('@/features/instructor/actions');
      const result = await uploadCourseImage(formData);

      if (result.success && result.data) {
        onChange(result.data.url);
      } else {
        alert(result.error || t('failedToUploadImage'));
        setPreview(value || null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('anErrorOccurred'));
      setPreview(value || null);
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={preview}
            alt="Course cover"
            fill
            className="object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className={cn(
            'relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed',
            'flex flex-col items-center justify-center gap-2',
            'transition-colors hover:bg-muted/50',
            disabled || isUploading
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          )}
        >
          {isUploading ? (
            <>
              <Upload className="h-10 w-10 animate-pulse text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t('uploading')}</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">{t('clickToUploadCourseCover')}</p>
              <p className="text-xs text-muted-foreground">
                {t('jpegPngWebpMax5mb')}
              </p>
            </>
          )}
        </button>
      )}
    </div>
  );
}
