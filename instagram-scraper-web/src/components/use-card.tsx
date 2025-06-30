import type { User } from "@/types";
import { CheckCircle } from "lucide-react";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const src = `http://localhost:3333/img/${user.id}_${user.username}.jpg`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={src}
            alt={user.username}
            width={48}
            height={48}
            className="rounded-full"
          />
          {user.is_verified && (
            <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-[#E1306C] bg-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {user.username}
          </p>
          <p className="text-sm text-gray-500 truncate">{user.full_name}</p>
          {user.is_private && (
            <p className="text-xs text-gray-400">Private account</p>
          )}
        </div>
      </div>
    </div>
  );
}
