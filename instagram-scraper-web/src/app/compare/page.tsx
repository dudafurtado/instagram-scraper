"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Users,
  HeartOff,
  HeartPlus,
  Minus,
  Plus,
  FileSpreadsheet,
} from "lucide-react";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";

import { ComparisonResult } from "@/types";
import UserCard from "@/components/use-card";
import { useApp } from "@/contexts/app-context";
import SearchFilter from "@/components/search-filter";
import { useUserFilter } from "@/hooks/use-user-filter";
import ProfileCard from "@/components/profile-card";

export default function ComparePage() {
  const { currentUser, setIsLoading } = useApp();
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [showNotFollowedBack, setShowNotFollowedBack] = useState(false);
  const [showNotFollowingBack, setShowNotFollowingBack] = useState(false);
  const notFollowedBackFilter = useUserFilter(result?.notFollowedBack || []);
  const notFollowingBackFilter = useUserFilter(result?.notFollowingBack || []);

  const handleCompare = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3333/instagram/compare?userId=${currentUser.user_id}`,
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

  const handleDownloadExcel = (
    type: "notFollowedBack" | "notFollowingBack"
  ) => {
    const data = result![type];

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, type);

    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `${type}.xlsx`);
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-800 font-medium">⚠️ No User Selected</p>
          <p className="text-yellow-600 mt-2">
            To see data here, go to the Collect page, open the Collected tab and
            click Compare on a user's card.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    handleCompare();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <Users className="w-6 h-6 text-white" />
        <h1 className="text-3xl font-bold text-white">Compare Followers</h1>
      </div>

      <section className="max-w-sm mx-auto">
        <ProfileCard key="1" profile={currentUser} status="lists" />
      </section>

      {result && (
        <div className="space-y-6">
          {/* SEÇÃO 1 */}
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartOff className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">
                  You follow but they don't follow back (
                  {result.notFollowedBack.length})
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadExcel("notFollowedBack")}
                  className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span className="text-xs text-white ml-1">Excel</span>
                </button>
                <button
                  onClick={() => setShowNotFollowedBack(!showNotFollowedBack)}
                  className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${showNotFollowedBack ? "bg-[#833AB4]" : "bg-[#833AB4]"} 
    hover:brightness-110 cursor-pointer
  `}
                >
                  {showNotFollowedBack ? (
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
                  {(showNotFollowedBack
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
                  {result.notFollowingBack.length})
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadExcel("notFollowingBack")}
                  className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span className="text-xs text-white ml-1">Excel</span>
                </button>
                <button
                  onClick={() => setShowNotFollowingBack(!showNotFollowingBack)}
                  className={`
    w-22 h-8 flex items-center justify-center 
    rounded-md transition-colors
    ${showNotFollowedBack ? "bg-[#833AB4]" : "bg-[#833AB4]"} 
    hover:brightness-110 cursor-pointer
  `}
                >
                  {showNotFollowingBack ? (
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
                  {(showNotFollowingBack
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
