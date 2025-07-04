"use client";

import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Share2,
  Waypoints,
  Minus,
  Plus,
  FileSpreadsheet,
} from "lucide-react";
import { saveAs } from "file-saver";
import { utils, write } from "xlsx";

import { VerificationResult } from "@/types";
import UserCard from "@/components/use-card";
import { useApp } from "@/contexts/app-context";
import SearchFilter from "@/components/search-filter";
import { useUserFilter } from "@/hooks/use-user-filter";
import LoadingSpinner from "@/components/loading-spinner";

export default function VerifyPage() {
  const { collectionData, setCollectionData, isLoading, setIsLoading } =
    useApp();
  const [userId, setUserId] = useState("");
  const [expectedFollowers, setExpectedFollowers] = useState("");
  const [expectedFollowing, setExpectedFollowing] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [checkData, setCheckData] = useState({
    followers: "",
    following: "",
  });
  const followersFilter = useUserFilter(collectionData.followers);
  const followingFilter = useUserFilter(collectionData.following);

  const calcDiff = (expected: number, found: number) =>
    Math.max(expected - found, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

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
          `http://localhost:3333/follow/data?userId=${userId}&followers=${expectedFollowers}&following=${expectedFollowing}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const {
            followersOk,
            followersFound,
            followers,
            followingOk,
            followingFound,
            following,
          } = await response.json();

          setResult({
            followersOk,
            followersFound,
            followingOk,
            followingFound,
          });
          setCollectionData({
            followers,
            following,
          });
        } else {
          throw new Error("Failed to verify collection");
        }
      }
    } catch (error) {
      console.error("Error verifying collection:", error);
      alert("Error verifying collection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = (type: "followers" | "following") => {
    const data = collectionData[type];

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
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircle className="w-6 h-6 text-[#E1306C]" />
          <h1 className="text-2xl font-bold text-[#E1306C]">
            Verify Collection
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="username_to_verify"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E1306C] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#C13584] focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Verify Collection</span>
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border ${
                  result.followersOk
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {result.followersOk ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3
                    className={`font-medium ${
                      result.followersOk ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Followers
                  </h3>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    result.followersOk ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Found: {result.followersFound} • Missing:{" "}
                  {calcDiff(parseInt(expectedFollowers), result.followersFound)}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  result.followingOk
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {result.followingOk ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3
                    className={`font-medium ${
                      result.followingOk ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Following
                  </h3>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    result.followingOk ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Found: {result.followingFound} • Missing:{" "}
                  {calcDiff(parseInt(expectedFollowing), result.followingFound)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {collectionData && (
        <div className="space-y-6">
          {collectionData.followers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-[#E1306C]" />
                  <h2 className="text-lg font-semibold text-[#E1306C]">
                    Followers ({collectionData.followers.length})
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadExcel("followers")}
                    className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center "
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
    hover:brightness-110
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Waypoints className="w-5 h-5 text-[#E1306C]" />
                  <h2 className="text-lg font-semibold text-[#E1306C]">
                    Following ({collectionData.following.length})
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadExcel("following")}
                    className="bg-[#FCAF45] hover:bg-[#FCAF45] p-2 rounded-lg flex items-center justify-center "
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
    hover:brightness-110
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
