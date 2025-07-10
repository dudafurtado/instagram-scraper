"use client";

import { useState } from "react";
import { CircleUser, IdCard } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/app-context";
import LoadingSpinner from "@/components/loading-spinner";

interface Props {
  onClose: () => void;
}

export default function AccountInfoModal({ onClose }: Props) {
  const { credentials, isLoading, setIsLoading } = useApp();
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(0);

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
    }, 1000);

    try {
      const response = await fetch("http://localhost:3333/instagram/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: search
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
      toast.success("Info Account collected successfully!");
      onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-tr from-[#fbad50] to-[#bc2a8d] rounded-3xl shadow-lg p-8 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CircleUser className="w-6 h-6" /> Account Info
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmitInfo} className="space-y-4">
          <label className="block text-sm font-medium text-white mb-2">
            Instagram Username One per Line
          </label>
          <textarea
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`username1\nusername2\nusername3\nusername4`}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fccc63] focus:border-transparent resize-none text-white bg-white/10"
            required
          />

          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#dc6c6f] h-2 rounded-full transition-all duration-300"
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
            className="w-full gap-2 bg-white/20 text-white py-3 px-4 rounded-xl font-medium hover:bg-white hover:text-[#dc6c6f] hover:z-30 hover:scale-102 transition-all duration-200 focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <IdCard size={20} /> Get Info
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
