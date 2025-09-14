import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // shadcn utility (if you use it)

type DragDropUploaderProps = {
  label: string;
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
};

export function DragDropUploader({
  label,
  onFiles,
  multiple = true,
  className,
}: DragDropUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition",
        isDragActive ? "border-primary bg-muted/50" : "border-border",
        className
      )}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-muted-foreground">{label}</p>
      <Button type="button" variant="outline" size="sm" className="mt-2">
        Choose File
      </Button>
    </div>
  );
}
