"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Key, LogOut, Save, Search } from "lucide-react";

import { Credentials } from "@/types";
import { useApp } from "@/contexts/app-context";
import LoadingSpinner from "@/components/loading-spinner";

export default function CollectionPage() {
  const {
    credentials,
    setCredentials,
    setCollectionData,
    setCurrentUser,
    isLoading,
    setIsLoading,
  } = useApp();
  const [formData, setFormData] = useState<Credentials>({
    username: "",
    password: "",
    search: "",
  });
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleInputChange = (field: keyof Credentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    setCredentials(formData);
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials) {
      toast.info("Please authenticate first");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    let fakeProgress = 0;
    const maxFakeProgress = 95;

    const interval = setInterval(() => {
      fakeProgress += 1;
      setProgress(Math.min(fakeProgress, maxFakeProgress));
    }, 3000);

    try {
      const response = await fetch("http://localhost:3333/instagram/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          search: formData.search
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        toast.error(
          `Request failed: ${response.status} ${response.statusText}`
        );
      }

      await response.json();

      setProgress(100);
      router.push("/collect");
    } catch (error) {
      toast.error("Error collecting data. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);

      setTimeout(() => {
        setProgress(0);
      }, 500);
    }
  };

  const handleLogout = () => {
    setCredentials(null);
    setCollectionData({ followers: [], following: [] });
    setCurrentUser("");
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
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Authentication</h1>
        <p className="text-lg text-white/80">
          Secure login and info collection setup
        </p>
      </div>

      <section className="flex items-center gap-8">
        <div className="w-1/2 bg-white/15 backdrop-blur-xl rounded-3xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Instagram Login</h1>
          </div>

          <form onSubmit={handleSubmitCredentials} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-white mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={formData[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent resize-none text-white"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-[#E1306C] py-3 px-4 rounded-xl font-medium hover:bg-white/70 focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 mt-6"
            >
              <>
                <Save size={20} />
                <span>Save Credentials</span>
              </>
            </button>

            {credentials && (
              <>
                <div className="p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Credentials saved successfully!
                  </p>
                  <p className="flex gap-1 text-green-800 text-sm mt-1">
                    If you want to logout,
                    <span
                      className="flex items-center gap-1 text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      click here <LogOut size={15} />
                    </span>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="w-1/2 bg-white/15 backdrop-blur-xl rounded-3xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Search className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Info Collection</h1>
          </div>

          <form onSubmit={handleSubmitInfo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Instagram Username One per Line
              </label>
              <textarea
                value={formData.search}
                onChange={(e) => handleInputChange("search", e.target.value)}
                placeholder={`username1
username2
username3`}
                className="w-full px-3 py-2 text-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E1306C] focus:border-transparent resize-none"
                rows={3}
                required
              />
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#E1306C] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white text-center">
                  Collecting data... {progress}%
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-[#E1306C] py-3 px-4 rounded-xl font-medium hover:bg-white/70 focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 mt-6"
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
