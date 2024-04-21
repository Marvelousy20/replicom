"use client";
import { useState } from "react";
import AvatarEditor from "@/components/profile/AvatarEditor";
import { Input } from "antd";
import BalanceDisplay from "@/components/profile/BalanceDisplay";
import { Button } from "@/components/ui/button";

interface User {
  email: string;
  avatarUrl: string;
  balance: string;
}

export default function Profile() {
  const [user, setUser] = useState<User>({
    email: "user@example.com",
    avatarUrl: "/img/avatar.jpeg",
    balance: "100.00",
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: event.target.value });
  };

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (event) {
        // Using optional chaining to safely access nested properties
        const result = event?.target?.result?.toString();
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  async function uploadAvatar(file: File): Promise<string> {
    const base64String = await readFileAsDataURL(file);
    localStorage.setItem("avatar", base64String);
    return base64String; // Use this string as an "image URL" for img src
  }

  const handleAvatarChange = async (file: File) => {
    const newAvatarUrl = await uploadAvatar(file);
    setUser({ ...user, avatarUrl: newAvatarUrl });
  };

  return (
    <div className="p-4 dark:bg-light-dark bg-white mt-32 px-10">
      <div className="flex gap-4 mb-4">
        <AvatarEditor
          src={user.avatarUrl}
          onAvatarChange={handleAvatarChange}
        />

        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">
            Profile Details
          </h2>
          {editMode ? (
            <Input
              value={user.email}
              onChange={handleEmailChange}
              className="dark:bg-gray-700 bg-gray-100 dark:text-slate-200"
            />
          ) : (
            <p className="dark:text-gray-300 text-gray-700 text-lg font-semibold">
              {user.email}
            </p>
          )}
          <BalanceDisplay balance={user.balance} />
          <Button onClick={() => setEditMode(!editMode)} className="mt-2">
            {editMode ? "Save Changes" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
