"use client";

import { useRouter } from "next/navigation";
import { Lock, Users, ImageIcon, CheckCircle } from "lucide-react";
import { InstagramProfile } from "@/types";
import { useApp } from "@/contexts/app-context";

interface ProfileCardProps {
  profile: InstagramProfile;
  status?: "to-collect" | "collected" | "lists";
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
  const { setCurrentUser } = useApp();
  const router = useRouter();

  const getStatusColor = () => {
    switch (status) {
      case "collected":
        return "bg-[#E1306C] text-white";
      case "to-collect":
        return "bg-[#833AB4] text-white";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "collected":
        return "Collected";
      default:
        return "To Collect";
    }
  };

  const src = `http://localhost:3333/img/${profile.user_id}_${profile.username}.jpg`;

  return (
    <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <img
            src={src}
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
          <h3 className="font-bold text-lg text-white">{profile.username}</h3>
          <p className="text-white">
            {profile.full_name.length > 20
              ? `${profile.full_name.slice(0, 20)}...`
              : profile.full_name}
          </p>

          {status !== "lists" && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor()}`}
            >
              {profile.is_private && <Lock size={14} className="mr-1" />}
              {getStatusLabel()}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-white">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="mr-1" />
          </div>
          <p className="text-sm font-semibol">
            {profile.follower_count.toLocaleString()}
          </p>
          <p className="text-xs">Followers</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="mr-1" />
          </div>
          <p className="text-sm font-semibold">
            {profile.following_count.toLocaleString()}
          </p>
          <p className="text-xs">Following</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <ImageIcon size={16} className="mr-1" />
          </div>
          <p className="text-sm font-semibold">
            {profile.posts.toLocaleString()}
          </p>
          <p className="text-xs">Posts</p>
        </div>
      </div>

      {status === "to-collect" && (
        <button
          onClick={onAction}
          disabled={disabled || profile.is_private}
          className="w-full bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {profile.is_private ? "Private Account" : actionLabel}
        </button>
      )}

      {status === "collected" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setCurrentUser(profile);
              router.push("/verify");
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white py-2 px-4 rounded-xl font-medium hover:bg-[#c12958] transition-colors cursor-pointer"
          >
            <CheckCircle size={15} />
            Verify
          </button>
          <button
            onClick={() => {
              setCurrentUser(profile);
              router.push("/compare");
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white py-2 px-4 rounded-xl font-medium hover:bg-[#6a2d91] transition-colors cursor-pointer"
          >
            <Users size={15} />
            Compare
          </button>
        </div>
      )}
    </div>
  );
}
