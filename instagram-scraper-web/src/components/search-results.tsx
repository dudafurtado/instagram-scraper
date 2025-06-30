"use client";

import type { User } from "@/types";
import UserCard from "./use-card";

interface SearchResultsProps {
  users: User[];
  title: string;
  searchTerm: string;
  totalCount: number;
  emptyMessage?: string;
}

export default function SearchResults({
  users,
  title,
  searchTerm,
  totalCount,
  emptyMessage = "No users found matching your search.",
}: SearchResultsProps) {
  const hasSearch = searchTerm.trim().length > 0;
  const displayTitle = hasSearch
    ? `${title} (${users.length} of ${totalCount})`
    : `${title} (${totalCount})`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{displayTitle}</h2>
        {hasSearch && users.length > 0 && (
          <span className="text-sm text-[#0095f6] bg-blue-50 px-2 py-1 rounded-full">
            Filtered
          </span>
        )}
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8">
          {hasSearch ? (
            <div>
              <p className="text-gray-500 mb-2">{emptyMessage}</p>
              <p className="text-sm text-gray-400">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No users to display</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
