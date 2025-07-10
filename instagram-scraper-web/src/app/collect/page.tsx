"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Clock, IdCard } from "lucide-react";

import { ScraperUser } from "@/types";
import ProfileCard from "@/components/profile-card";
import Tabs from "@/components/tabs";
import AccountInfoModal from "@/components/search-account";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("to-collect");
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState<{
    to_collect: ScraperUser[];
    collecting: ScraperUser[];
    collected: ScraperUser[];
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
                <div
                  key={index}
                  className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 shadow-lg text-white"
                >
                  <div className="flex items-center space-x-4 mb-4 ">
                    <img
                      src={`http://localhost:3333/img/${profile.user_id}_${profile.username}.jpg`}
                      alt={profile.username}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{profile.username}</h3>
                      <p>{profile.full_name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={16} />
                        <span className="text-sm">
                          {profile.progress ? (
                            <>
                              Started{" "}
                              {new Date(
                                profile.progress.started_at
                              ).toLocaleString()}
                            </>
                          ) : (
                            "No data"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-white text-[#dc6c6f] px-3 py-1 rounded-full text-sm font-medium">
                        {profile.progress ? (
                          <>Position #{profile.progress.position_in_queue}</>
                        ) : (
                          "No data"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm">Followers Progress</p>
                      <div className="bg-white/20 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#E1306C] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              profile.progress &&
                              (profile.progress.followers_collected /
                                profile.progress.total_followers) *
                                100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">
                        {profile.progress && (
                          <>
                            {profile.progress.followers_collected} /{" "}
                            {profile.progress.total_followers}
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">Following Progress</p>
                      <div className="bg-white/20 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#833AB4] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              profile.progress &&
                              (profile.progress.following_collected /
                                profile.progress.total_following) *
                                100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">
                        {profile.progress && (
                          <>
                            {profile.progress.following_collected} /{" "}
                            {profile.progress.total_following}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-3">
                    <p className="text-sm">
                      Images Downloaded:{" "}
                      {profile.progress ? (
                        <>
                          {profile.progress.images_downloaded} /{" "}
                          {profile.progress.total_images}
                        </>
                      ) : (
                        ""
                      )}
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Collect Dashboard
        </h1>
        <p className="text-lg text-white/80">
          Manage your Instagram data collection
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-white/20 text-white py-2 px-4 rounded-xl font-medium hover:bg-white hover:text-[#dc6c6f] hover:z-30 hover:scale-102 transition-all duration-200 shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <IdCard /> Get Account Info
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {renderTabContent}
      </Tabs>

      {showModal && <AccountInfoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
