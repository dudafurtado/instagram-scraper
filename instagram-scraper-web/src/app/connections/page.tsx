"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Share2,
  Waypoints,
  Minus,
  Plus,
  FileSpreadsheet,
  HeartPlus,
  HeartOff,
} from "lucide-react";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";

import UserCard from "@/components/use-card";
import { useApp } from "@/contexts/app-context";
import SearchFilter from "@/components/search-filter";
import { useUserFilter } from "@/hooks/use-user-filter";
import ProfileCard from "@/components/profile-card";
import { ComparisonResult } from "@/types";
import InfoAccountDetail from "@/components/info-account";

export default function ConnectionsPage() {
  const { currentUser, setIsLoading } = useApp();

  const [collectionData, setCollectionData] = useState({
    followers: [],
    following: [],
  });
  const [result, setResult] = useState<ComparisonResult>({
    notFollowedBack: [],
    notFollowingBack: [],
  });
  const [expanded, setExpanded] = useState({
    followers: false,
    following: false,
    notFollowedBack: false,
    notFollowingBack: false,
  });

  const followersFilter = useUserFilter(collectionData.followers ?? []);
  const followingFilter = useUserFilter(collectionData.following ?? []);
  const notFollowedBackFilter = useUserFilter(result?.notFollowedBack ?? []);
  const notFollowingBackFilter = useUserFilter(result?.notFollowingBack ?? []);

  const handleDownloadExcel = (type: "followers" | "following") => {
    const data = collectionData[type];

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, type);

    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `${type}.xlsx`);
  };

  const handleCompare = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3333/instagram/compare?userId=${currentUser?.user_id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();

      console.log("Comparison Result:", data);

      setResult(data);
    } catch (error) {
      toast.error("Error comparing followers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendships = async () => {
    setIsLoading(true);

    try {
      const checkRes = await fetch(
        `http://localhost:3333/instagram/friendships?userId=${currentUser?.user_id}`,
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
    handleCompare();
  }, []);

  if (!currentUser) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-800 font-medium">⚠️ No User Selected</p>
          <p className="text-yellow-600 mt-2">
            To see data here, go to the Collect page, open the Collected tab and
            click Connections on a user's card.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white">Connections</h1>
        <p className="text-lg text-white/80">
          Verify and Compare Followers and Following
        </p>
      </div>

      <section className="max-w-5xl mx-auto">
        <InfoAccountDetail {...currentUser} />
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
                    className="bg-[#fbad50] hover:bg-[#fbad50] hover:z-30 hover:scale-105 p-2 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-white" />
                    <span className="text-xs text-white ml-1">Excel</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        followers: !prev.followers,
                      }))
                    }
                    className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${expanded.followers ? "bg-[#bc2a8d]/70" : "bg-[#bc2a8d]/70"} 
    hover:z-30 hover:scale-105 hover:brightness-110 cursor-pointer
  `}
                  >
                    {expanded.followers ? (
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
                {(expanded.followers
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
                    className="bg-[#fbad50] hover:bg-[#fbad50] hover:z-30 hover:scale-105 p-2 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-white" />
                    <span className="text-xs text-white ml-1">Excel</span>
                  </button>
                  <button
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        following: !prev.following,
                      }))
                    }
                    className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${expanded.following ? "bg-[#bc2a8d]/70" : "bg-[#bc2a8d]/70"} 
    hover:z-30 hover:scale-105
    hover:brightness-110 cursor-pointer
  `}
                  >
                    {expanded.following ? (
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
                {(expanded.following
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

      {result && (
        <div className="space-y-6">
          {/* SEÇÃO 1 */}
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartOff className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">
                  You follow but they don't follow back (
                  {result?.notFollowedBack?.length ?? 0})
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  //   onClick={() => handleDownloadExcel("notFollowedBack")}
                  className="bg-[#fbad50] hover:bg-[#fbad50] hover:z-30 hover:scale-105 p-2 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span className="text-xs text-white ml-1">Excel</span>
                </button>
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      notFollowedBack: !prev.notFollowedBack,
                    }))
                  }
                  className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${expanded.notFollowedBack ? "bg-[#bc2a8d]/70" : "bg-[#bc2a8d]/70"} 
    hover:z-30 hover:scale-105 hover:brightness-110 cursor-pointer
  `}
                >
                  {expanded.notFollowedBack ? (
                    <>
                      <Minus className="w-4 h-4 text-white" />
                      <span className="text-xs text-white ml-1">Minimize</span>
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

            {result.notFollowedBack.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                🎉 Everyone you follow follows you back!
              </p>
            ) : (
              <>
                <SearchFilter
                  onSearch={notFollowedBackFilter.handleSearch}
                  placeholder="Search users..."
                  className="w-full mb-4"
                  filtered={notFollowedBackFilter.filteredCount}
                  total={notFollowedBackFilter.totalUsers}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(expanded.notFollowedBack
                    ? notFollowedBackFilter.filteredUsers
                    : notFollowedBackFilter.filteredUsers.slice(0, 9)
                  ).map((user, index) => (
                    <UserCard key={index} user={user} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* SEÇÃO 2 */}
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartPlus className="w-5 h-5 text-white rotate-180" />
                <h2 className="text-lg font-semibold text-white">
                  They follow you but you don't follow back (
                  {result.notFollowingBack.length ?? 0})
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  //   onClick={() => handleDownloadExcel("notFollowingBack")}
                  className="bg-[#fbad50] hover:bg-[#fbad50] hover:z-30 hover:scale-105 p-2 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span className="text-xs text-white ml-1">Excel</span>
                </button>
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      notFollowingBack: !prev.notFollowingBack,
                    }))
                  }
                  className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${expanded.notFollowedBack ? "bg-[#bc2a8d]/70" : "bg-[#bc2a8d]/70"} 
    hover:z-30 hover:scale-105 hover:brightness-110 cursor-pointer
  `}
                >
                  {expanded.notFollowingBack ? (
                    <>
                      <Minus className="w-4 h-4 text-white" />
                      <span className="text-xs text-white ml-1">Minimize</span>
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

            {result.notFollowingBack.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                You follow everyone who follows you!
              </p>
            ) : (
              <>
                <SearchFilter
                  onSearch={notFollowingBackFilter.handleSearch}
                  placeholder="Search users..."
                  className="w-full mb-4"
                  filtered={notFollowingBackFilter.filteredCount}
                  total={notFollowingBackFilter.totalUsers}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(expanded.notFollowingBack
                    ? notFollowingBackFilter.filteredUsers
                    : notFollowingBackFilter.filteredUsers.slice(0, 9)
                  ).map((user, index) => (
                    <UserCard key={index} user={user} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
