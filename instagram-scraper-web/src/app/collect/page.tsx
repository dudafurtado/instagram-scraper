"use client";

import { Clock, CheckCircle } from "lucide-react";
import { CollectionJob, InstagramProfile } from "@/types";
import ProfileCard from "@/components/profile-card";
import Tabs from "@/components/tabs";

export default function DashboardPage() {
  // Mock data
  const toCollectProfiles: InstagramProfile[] = [
    {
      id: "1",
      username: "johndoe",
      full_name: "John Doe",
      profile_pic_url: "/placeholder.svg?height=64&width=64",
      follower_count: 1250,
      following_count: 890,
      posts_count: 156,
      is_private: false,
      is_verified: false,
    },
    {
      id: "2",
      username: "janeprivate",
      full_name: "Jane Private",
      profile_pic_url: "/placeholder.svg?height=64&width=64",
      follower_count: 2100,
      following_count: 450,
      posts_count: 89,
      is_private: true,
      is_verified: true,
    },
  ];

  const collectingJobs: CollectionJob[] = [
    {
      id: "1",
      profile: {
        id: "3",
        username: "collecting_user",
        full_name: "Collecting User",
        profile_pic_url: "/placeholder.svg?height=48&width=48",
        follower_count: 5000,
        following_count: 1200,
        posts_count: 300,
        is_private: false,
        is_verified: false,
      },
      status: "collecting",
      progress: {
        followers_collected: 2500,
        following_collected: 800,
        total_followers: 5000,
        total_following: 1200,
        images_downloaded: 12,
        total_images: 50,
      },
      started_at: "2024-01-15T10:30:00Z",
      position_in_queue: 1,
    },
  ];

  const collectedProfiles: InstagramProfile[] = [
    {
      id: "4",
      username: "completed_user",
      full_name: "Completed User",
      profile_pic_url: "/placeholder.svg?height=64&width=64",
      follower_count: 3500,
      following_count: 800,
      posts_count: 200,
      is_private: false,
      is_verified: true,
      created_at: "2024-01-14T15:20:00Z",
    },
  ];

  const tabs = [
    { id: "to-collect", label: "To Collect", count: toCollectProfiles.length },
    { id: "collecting", label: "Collecting", count: collectingJobs.length },
    { id: "collected", label: "Collected", count: collectedProfiles.length },
  ];

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case "to-collect":
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toCollectProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                status="to-collect"
                onAction={() =>
                  alert(`Starting collection for ${profile.username}`)
                }
                actionLabel="Start Collection"
              />
            ))}
          </div>
        );

      case "collecting":
        return (
          <div className="space-y-6">
            {collectingJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={job.profile.profile_pic_url || "/placeholder.svg"}
                    alt={job.profile.username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.profile.username}
                    </h3>
                    <p className="text-gray-600">{job.profile.full_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock size={16} className="text-[#FCAF45]" />
                      <span className="text-sm text-gray-500">
                        Started {new Date(job.started_at!).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-[#FCAF45] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Position #{job.position_in_queue}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Followers Progress</p>
                    <div className="bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-[#E1306C] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (job.progress.followers_collected /
                              job.progress.total_followers) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {job.progress.followers_collected} /{" "}
                      {job.progress.total_followers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Following Progress</p>
                    <div className="bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-[#833AB4] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (job.progress.following_collected /
                              job.progress.total_following) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {job.progress.following_collected} /{" "}
                      {job.progress.total_following}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-sm text-gray-600">
                    Images Downloaded: {job.progress.images_downloaded} /{" "}
                    {job.progress.total_images}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case "collected":
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={profile.profile_pic_url || "/placeholder.svg"}
                    alt={profile.username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {profile.username}
                    </h3>
                    <p className="text-gray-600">{profile.full_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-gray-500">
                        Collected{" "}
                        {new Date(profile.created_at!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {profile.follower_count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {profile.following_count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {profile.posts_count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-[#E1306C] text-white py-2 px-4 rounded-xl font-medium hover:bg-[#c12958] transition-colors">
                    Verify
                  </button>
                  <button className="bg-[#833AB4] text-white py-2 px-4 rounded-xl font-medium hover:bg-[#6a2d91] transition-colors">
                    Compare
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Collection Dashboard
        </h1>
        <p className="text-xl text-white/80">
          Manage your Instagram data collection
        </p>
      </div>

      <Tabs tabs={tabs} defaultTab="to-collect">
        {renderTabContent}
      </Tabs>
    </div>
  );
}
