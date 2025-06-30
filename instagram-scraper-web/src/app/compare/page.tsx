"use client";

import { useState } from "react";
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
import LoadingSpinner from "@/components/loading-spinner";

export default function ComparePage() {
  const { isLoading, setIsLoading } = useApp();
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [showNotFollowedBack, setShowNotFollowedBack] = useState(false);
  const [showNotFollowingBack, setShowNotFollowingBack] = useState(false);
  const [checkData, setCheckData] = useState({
    followers: "",
    following: "",
  });
  const notFollowedBackFilter = useUserFilter(result?.notFollowedBack || []);
  const notFollowingBackFilter = useUserFilter(result?.notFollowingBack || []);

  const handleCompare = async () => {
    if (!userId) {
      alert("Please enter a user ID first");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const checkRes = await fetch(
        `http://localhost:3333/follow/files?userId=${userId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await checkRes.json();

      setCheckData(data);

      if (data.followers === "exists" || data.following === "exists") {
        const response = await fetch(
          `http://localhost:3333/relationship?id=${userId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setResult(data);
        } else {
          throw new Error("Failed to compare followers");
        }
      }
    } catch (error) {
      console.error("Error comparing followers:", error);
      alert("Error comparing followers. Please try again.");
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

  if (
    checkData?.followers === "not_found" ||
    checkData?.following === "not_found"
  ) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-medium">⚠️ Collection Required</p>
          <p className="text-yellow-600 mt-2">
            {checkData?.followers === "not_found" &&
            checkData?.following === "not_found"
              ? "You must collect BOTH followers and following first."
              : checkData?.followers === "not_found"
              ? "You must collect FOLLOWERS first."
              : "You must collect FOLLOWING first."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-6 h-6 text-[#E1306C]" />
          <h1 className="text-2xl font-bold text-[#E1306C]">
            Compare Followers
          </h1>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram User ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Instagram user ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent"
            required
          />
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4 text-justify">
            Compare your followers and following to see who doesn't follow you
            back and who you don't follow back.
          </p>

          <button
            onClick={handleCompare}
            disabled={isLoading}
            className="w-full bg-[#E1306C] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#C13584] focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Users size={20} />
                <span>Compare Followers vs Following</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          {/* SEÇÃO 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartOff className="w-5 h-5 text-[#E1306C]" />
                <h2 className="text-lg font-semibold text-[#E1306C]">
                  You follow but they don't follow back (
                  {result.notFollowedBack.length})
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadExcel("notFollowedBack")}
                  className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center "
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
    hover:brightness-110
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartPlus className="w-5 h-5 text-[#E1306C] rotate-180" />
                <h2 className="text-lg font-semibold text-[#E1306C]">
                  They follow you but you don't follow back (
                  {result.notFollowingBack.length})
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadExcel("notFollowingBack")}
                  className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center "
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
    hover:brightness-110
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
