"use client";
import { useRef } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";

interface AvatarEditorProps {
  src: string;
  onAvatarChange: (file: File) => void; // Callback to handle avatar change
}

const AvatarEditor: React.FC<AvatarEditorProps> = ({ src, onAvatarChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarEdit = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onAvatarChange(event.target.files[0]);
    }
  };

  return (
    <div className="avatar-wrapper" onClick={handleAvatarEdit}>
      <Image
        src={src}
        alt="Avatar"
        width={250}
        height={250}
        className="h-52 w-52 rounded-full dark:shadow-white shadow-md"
      />
      <div className="tooltip">Change Image</div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default AvatarEditor;
