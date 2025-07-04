"use client";

import { useState } from "react";
import { Download, Key, Save, Search } from "lucide-react";

import { useApp } from "@/contexts/app-context";
import { Credentials } from "@/types";
import LoadingSpinner from "@/components/loading-spinner";

export default function CollectionPage() {
  const { credentials, setCredentials, isLoading, setIsLoading } = useApp();
  const [formData, setFormData] = useState<Credentials>({
    sessionId: "",
    csrfToken: "",
    dsUserId: "",
    igAppId: "",
  });
  const [userId, setUserId] = useState("");
  const [collectFollowers, setCollectFollowers] = useState(true);
  const [collectFollowing, setCollectFollowing] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleInputChange = (field: keyof Credentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    setCredentials(formData);
    setFormData({
      sessionId: "",
      csrfToken: "",
      dsUserId: "",
      igAppId: "",
    });
  };

  const handleSubmitFollow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials) {
      alert("Please authenticate first");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    let type: string | null = null;

    if (collectFollowers && collectFollowing) {
      type = "both";
    } else if (collectFollowers) {
      type = "followers";
    } else if (collectFollowing) {
      type = "following";
    } else {
      alert("Select at least one option.");
      return;
    }

    let fakeProgress = 0;
    const maxFakeProgress = 95;

    const interval = setInterval(() => {
      fakeProgress += 1;
      setProgress(Math.min(fakeProgress, maxFakeProgress));
    }, 3000);

    try {
      const response = await fetch("http://localhost:3333/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: credentials.sessionId,
          csrf_token: credentials.csrfToken,
          ds_user_id: credentials.dsUserId,
          ig_app_id: credentials.igAppId,
          user_id: userId,
          type,
        }),
      });

      if (!response.ok) {
        alert(`Request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      setProgress(100);
    } catch (error) {
      console.error("Error collecting data:", error);
      alert("Error collecting data. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);

      setTimeout(() => {
        setProgress(0);
      }, 500);
    }
  };

  const fields = [
    {
      key: "username" as keyof Credentials,
      label: "Username",
      placeholder: "my_username",
    },
    {
      key: "password" as keyof Credentials,
      label: "Password",
      placeholder: "********",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Authentication</h1>
        <p className="text-xl text-white/80">
          Secure login and data collection setup
        </p>
      </div>

      <section className="grid sm:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-6 h-6 text-[#E1306C]" />
            <h1 className="text-2xl font-bold text-[#E1306C]">
              Instagram Login
            </h1>
          </div>

          <form onSubmit={handleSubmitCredentials} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={formData[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent resize-none"
                  required
                />
              </div>
            ))}

            {credentials && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✅ Credentials saved successfully!
                </p>
                <p className="text-green-600 text-sm mt-1">
                  You can now proceed to info collection.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1306C] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#C13584] focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              <>
                <Save size={20} />
                <span>Save Credentials</span>
              </>
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Search className="w-6 h-6 text-[#E1306C]" />
            <h1 className="text-2xl font-bold text-[#E1306C]">
              Info Collection
            </h1>
          </div>

          <form onSubmit={handleSubmitFollow} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Username
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="username_to_collect"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent"
                required
              />
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">
                We'll collect profile information to next step of followers and
                following collection.
              </p>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#E1306C] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Collecting data... {progress}%
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!collectFollowers && !collectFollowing)}
              className="w-full bg-[#E1306C] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#C13584] focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Download size={20} />
                  <span>Start Collection</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
