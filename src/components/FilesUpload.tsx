"use client";

import { useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { File } from "lucide-react";

interface DropzoneProps {
  onDrop: (acceptedFiles: FileWithPath[]) => void;
}

export default function FileUpload({ onDrop }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  return (
    <div
      {...getRootProps()}
      className="mt-1 px-2 items-center py-2 block w-full border opacity-60 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
    >
      <div className="flex items-center gap-2">
        <File size={16} />
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drop a file or click to upload</p>
        )}
      </div>
    </div>
  );
}
