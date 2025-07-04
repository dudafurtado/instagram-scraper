"use client";

import Image from "next/image";
import { Lock, Users, ImageIcon } from "lucide-react";
import { InstagramProfile } from "@/types";

interface ProfileCardProps {
  profile: InstagramProfile;
  status?: "to-collect" | "collecting" | "collected";
  onAction?: () => void;
  actionLabel?: string;
  disabled?: boolean;
}

export default function ProfileCard({
  profile,
  status = "to-collect",
  onAction,
  actionLabel = "Start Collection",
  disabled = false,
}: ProfileCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "collecting":
        return "bg-[#FCAF45] text-white";
      case "collected":
        return "bg-green-500 text-white";
      default:
        return "bg-[#E1306C] text-white";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "collecting":
        return "Collecting";
      case "collected":
        return "Collected";
      default:
        return "To Collect";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <Image
            src={
              profile.profile_pic_url || "/placeholder.svg?height=64&width=64"
            }
            alt={profile.username}
            width={64}
            height={64}
            className="rounded-full"
          />
          {profile.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">
            {profile.username}
          </h3>
          <p className="text-gray-600">{profile.full_name}</p>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor()}`}
          >
            {profile.is_private && <Lock size={14} className="mr-1" />}
            {getStatusLabel()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-gray-400 mr-1" />
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {profile.follower_count.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-gray-400 mr-1" />
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {profile.following_count.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <ImageIcon size={16} className="text-gray-400 mr-1" />
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {profile.posts_count.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          disabled={disabled || profile.is_private}
          className="w-full bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {profile.is_private ? "Private Account" : actionLabel}
        </button>
      )}
    </div>
  );
}
