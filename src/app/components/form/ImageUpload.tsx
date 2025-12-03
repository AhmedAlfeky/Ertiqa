"use client";

import React, { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import { uploadImage, type ImageUploadResult } from "@/lib/utils/imagekit";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string[];
  fileIds?: string[];
  onChange: (images: ImageData[]) => void;
  maxFiles?: number;
  folder?: string;
  className?: string;
  disabled?: boolean;
  onDelete?: (fileId: string) => Promise<void>;
}

interface ImageData {
  url: string;
  fileId: string;
}

export function ImageUpload({
  value = [],
  fileIds = [],
  onChange,
  maxFiles = 5,
  folder = "products",
  className,
  disabled = false,
  onDelete,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images: ImageData[] = value.map((url, index) => ({
    url,
    fileId: fileIds[index] || "",
  }));

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || disabled) return;

      const remainingSlots = maxFiles - images.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      setUploading(true);

      try {
        const uploadPromises = filesToUpload.map((file) => {
          if (!file.type.startsWith("image/")) {
            throw new Error(`${file.name} is not an image file`);
          }

          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`${file.name} is too large (max 5MB)`);
          }

          return uploadImage(file, folder);
        });

        const results = await Promise.all(uploadPromises);

        const newImages: ImageData[] = results.map((result) => ({
          url: result.url,
          fileId: result.fileId,
        }));

        const updatedImages = [...images, ...newImages];

        onChange(updatedImages as ImageData[]);

        toast.success(`${results.length} image(s) uploaded successfully`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to upload images");
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [images, maxFiles, folder, onChange, disabled]
  );

  const handleRemove = useCallback(
    async (index: number) => {
      const imageToRemove = images[index];
      const updatedImages = images.filter((_, i) => i !== index);

      if (onDelete && imageToRemove.fileId) {
        try {
          await onDelete(imageToRemove.fileId);
          toast.success("Image deleted successfully");
        } catch (error) {
          toast.error("Failed to delete image from storage");
          return;
        }
      }

      onChange(updatedImages as ImageData[]);
    },
    [images, onChange, onDelete]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0] && !disabled) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload, disabled]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700",
          disabled && "opacity-50 cursor-not-allowed",
          images.length >= maxFiles && "opacity-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          title="Upload images"
          placeholder="Upload images"
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={disabled || uploading || images.length >= maxFiles}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : (
            <Upload className="h-10 w-10 text-gray-400" />
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading || images.length >= maxFiles}
            >
              Click to upload
            </Button>{" "}
            or drag and drop
          </div>

          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB ({images.length}/{maxFiles})
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <img src={image.url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />

              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 z-50 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="text-center py-4">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
