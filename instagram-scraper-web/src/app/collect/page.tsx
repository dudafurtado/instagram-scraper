"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import { CollectionJob, InstagramProfile } from "@/types";
import ProfileCard from "@/components/profile-card";
import Tabs from "@/components/tabs";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("to-collect");
  const [accounts, setAccounts] = useState<{
    to_collect: InstagramProfile[];
    collecting: any[];
    collected: InstagramProfile[];
  }>({
    to_collect: [],
    collecting: [],
    collected: [],
  });

  const tabs = [
    {
      id: "to-collect",
      label: "To Collect",
      count: accounts.to_collect.length,
    },
    {
      id: "collecting",
      label: "Collecting",
      count: accounts.collecting.length,
    },
    { id: "collected", label: "Collected", count: accounts.collected.length },
  ];

  async function handleCollect(userId: string) {
    try {
      const res = await fetch(
        `http://localhost:3333/instagram/collect?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        toast.error(`Erro: ${error.error}`);
      } else {
        const data = await res.json();
        await fetchAccounts();
        setActiveTab("collecting");
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("Falha ao enviar coleta.");
    }
  }

  async function fetchAccounts() {
    const res = await fetch("http://localhost:3333/instagram/accounts");
    const data = await res.json();
    setAccounts(data);
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case "to-collect":
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.to_collect.length &&
              accounts.to_collect.map((profile: any, index: any) => (
                <ProfileCard
                  key={index}
                  profile={profile}
                  status="to-collect"
                  onAction={() => handleCollect(profile.user_id)}
                  actionLabel="Start Collection"
                />
              ))}
          </div>
        );

      case "collecting":
        return (
          <div className="space-y-6">
            {accounts.collecting.length &&
              accounts.collecting.map((profile, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={`http://localhost:3333/img/${profile.user_id}_${profile.username}.jpg`}
                      alt={profile.username}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {profile.username}
                      </h3>
                      <p className="text-gray-600">{profile.full_name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={16} className="text-[#FCAF45]" />
                        <span className="text-sm text-gray-500">
                          Started{" "}
                          {new Date(profile.started_at!).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-[#FCAF45] text-white px-3 py-1 rounded-full text-sm font-medium">
                        Position #{profile.position_in_queue}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Followers Progress
                      </p>
                      <div className="bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#E1306C] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (profile.progress.followers_collected /
                                profile.progress.total_followers) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {profile.progress.followers_collected} /{" "}
                        {profile.progress.total_followers}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Following Progress
                      </p>
                      <div className="bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#833AB4] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (profile.progress.following_collected /
                                profile.progress.total_following) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {profile.progress.following_collected} /{" "}
                        {profile.progress.total_following}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-sm text-gray-600">
                      Images Downloaded: {profile.progress.images_downloaded} /{" "}
                      {profile.progress.total_images}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        );

      case "collected":
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.collected.length &&
              accounts.collected.map((profile: any, index) => (
                <ProfileCard key={index} profile={profile} status="collected" />
              ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Collect Dashboard
        </h1>
        <p className="text-lg text-white/80">
          Manage your Instagram data collection
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {renderTabContent}
      </Tabs>
    </div>
  );
}
