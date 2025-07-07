"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Share2,
  Waypoints,
  Minus,
  Plus,
  FileSpreadsheet,
  CheckCircle,
} from "lucide-react";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";

import UserCard from "@/components/use-card";
import { useApp } from "@/contexts/app-context";
import SearchFilter from "@/components/search-filter";
import { useUserFilter } from "@/hooks/use-user-filter";
import ProfileCard from "@/components/profile-card";

export default function VerifyPage() {
  const { currentUser, collectionData, setCollectionData, setIsLoading } =
    useApp();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const followersFilter = useUserFilter(collectionData.followers);
  const followingFilter = useUserFilter(collectionData.following);

  const handleDownloadExcel = (type: "followers" | "following") => {
    const data = collectionData[type];

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, type);

    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `${type}.xlsx`);
  };

  if (!currentUser) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-800 font-medium">⚠️ No User Selected</p>
          <p className="text-yellow-600 mt-2">
            To see data here, go to the Collect page, open the Collected tab and
            click Verify on a user's card.
          </p>
        </div>
      </section>
    );
  }

  const handleFriendships = async () => {
    setIsLoading(true);

    try {
      const checkRes = await fetch(
        `http://localhost:3333/instagram/friendships?userId=${currentUser.user_id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await checkRes.json();

      setCollectionData(data);
    } catch (error) {
      toast.error("Error verifying collection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFriendships();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <CheckCircle className="w-6 h-6 text-white" />
        <h1 className="text-3xl font-bold text-white">Verify Collection</h1>
      </div>

      <section className="max-w-sm mx-auto">
        <ProfileCard key="1" profile={currentUser} status="lists" />
      </section>

      {collectionData && (
        <div className="space-y-6">
          {collectionData.followers.length > 0 && (
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-sm p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">
                    Followers ({collectionData.followers.length})
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadExcel("followers")}
                    className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-white" />
                    <span className="text-xs text-white ml-1">Excel</span>
                  </button>

                  <button
                    onClick={() => setShowFollowers(!showFollowers)}
                    className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${showFollowers ? "bg-[#833AB4]" : "bg-[#6e2b97]"} 
    hover:brightness-110 cursor-pointer
  `}
                  >
                    {showFollowers ? (
                      <>
                        <Minus className="w-4 h-4 text-white" />
                        <span className="text-xs text-white ml-1">
                          Minimize
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-white" />
                        <span className="text-xs text-white ml-1">Expand</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <SearchFilter
                onSearch={followersFilter.handleSearch}
                placeholder="Search followers..."
                className="w-full mb-4"
                filtered={followersFilter.filteredUsers.length}
                total={collectionData.followers.length}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(showFollowers
                  ? followersFilter.filteredUsers
                  : followersFilter.filteredUsers.slice(0, 9)
                ).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}

          {collectionData.following.length > 0 && (
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Waypoints className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">
                    Following ({collectionData.following.length})
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadExcel("following")}
                    className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-white" />
                    <span className="text-xs text-white ml-1">Excel</span>
                  </button>
                  <button
                    onClick={() => setShowFollowing(!showFollowing)}
                    className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${showFollowing ? "bg-[#833AB4]" : "bg-[#833AB4]"} 
    hover:brightness-110 cursor-pointer
  `}
                  >
                    {showFollowing ? (
                      <>
                        <Minus className="w-4 h-4 text-white" />
                        <span className="text-xs text-white ml-1">
                          Minimize
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-white" />
                        <span className="text-xs text-white ml-1">Expand</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <SearchFilter
                onSearch={followingFilter.handleSearch}
                placeholder="Search following..."
                className="w-full mb-4"
                filtered={followingFilter.filteredUsers.length}
                total={collectionData.following.length}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(showFollowing
                  ? followingFilter.filteredUsers
                  : followingFilter.filteredUsers.slice(0, 9)
                ).map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
