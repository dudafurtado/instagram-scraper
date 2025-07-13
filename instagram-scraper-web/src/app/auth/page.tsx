"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Save,
  SendToBack,
  ShieldCheck,
} from "lucide-react";

import { Credentials } from "@/types";
import { useApp } from "@/contexts/app-context";
import api from "@/lib/axios";

export default function CollectionPage() {
  const {
    credentials,
    setCredentials,
    setCurrentUser,
    isLoading,
    setIsLoading,
  } = useApp();
  const [formData, setFormData] = useState<Credentials>({
    method: "credentials",
    username: "",
    password: "",
    cookies: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const fields = [
    {
      key: "username" as keyof Credentials,
      label: "Username",
      placeholder: "my_username",
      type: "text",
    },
    {
      key: "password" as keyof Credentials,
      label: "Password",
      placeholder: "********",
      type: showPassword ? "text" : "password",
    },
  ];

  const handleInputChange = (field: keyof Credentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const dataToSend = {
      ...formData,
      ...(formData.method === "cookies"
        ? { username: undefined, password: undefined }
        : { cookies: undefined }),
    };

    try {
      const response = await api.post("/login", dataToSend);
      const data = response.data;

      setCredentials(data);

      setTimeout(() => {
        router.push("/collect");
      }, 5000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Unexpected error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteraction = async () => {
    try {
      const res = await api.get("/interaction");

      if (res.data.status === "Error") {
        return toast.error(res.data.message);
      }

      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Unexpected error. Please try again."
      );
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.delete("/logout");

      console.log(res);

      if (res.data.status === "Error") {
        return toast.error(res.data.message);
      }

      setCredentials(false);
      setCurrentUser(null);
      setFormData({
        method: "credentials",
        username: "",
        password: "",
        cookies: "",
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Unexpected error. Please try again."
      );
    }
  };

  const handleSession = async () => {
    try {
      const res = await api.get("/session");

      if (res.data.status === "Error") {
        return toast.error(res.data.message);
      }

      setCredentials(true);
      return toast.success(res.data.message);
    } catch (error: any) {
      return toast.error(
        error.response?.data?.message || "Unexpected error. Please try again."
      );
    }
  };

  useEffect(() => {
    handleSession();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Authentication</h1>
        <p className="text-lg text-white/80">
          Secure login and info collection setup
        </p>
      </div>

      <section className="flex justify-center items-center">
        <div className="w-full max-w-xl bg-white/15 backdrop-blur-xl rounded-3xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <KeyRound className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">
              Instagram Credentials
            </h1>
          </div>

          <p className="text-white text-sm mb-6 leading-relaxed">
            You can get Instagram data using two different methods:
            <br />
            <br />
            <strong>1. Login with username and password</strong>: This method
            uses browser automation to simulate a real login, capture your
            session data, and save cookies for future automated actions.
            <br />
            <strong>2. Login using exported cookies</strong>: If you're already
            logged in on your browser, you can export your Instagram cookies
            using a browser extension like{" "}
            <a
              href="https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg"
              target="_blank"
              className="underline text-[#fccc63]"
            >
              EditThisCookie
            </a>
            . Just paste the exported cookie data here, and the system will
            reuse your active session securely and efficiently.
          </p>

          <hr className="my-6 border-t border-white/30" />

          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div className="flex flex-col space-y-2 mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Choose login method:
              </label>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="loginMethod"
                    value="credentials"
                    checked={formData.method === "credentials"}
                    onChange={() => handleInputChange("method", "credentials")}
                    className="appearance-none w-4 h-4 border-2 border-[#fccc63] rounded-full bg-transparent checked:bg-[#fccc63] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={credentials}
                  />

                  <span className="text-white text-sm">
                    Username & Password
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="loginMethod"
                    value="cookies"
                    checked={formData.method === "cookies"}
                    onChange={() => handleInputChange("method", "cookies")}
                    className="appearance-none w-4 h-4 border-2 border-[#fccc63] rounded-full bg-transparent checked:bg-[#fccc63] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={credentials}
                  />

                  <span className="text-white text-sm">Exported Cookies</span>
                </label>
              </div>
            </div>

            {formData.method === "credentials" ? (
              fields.map((field) => (
                <div key={field.key} className="relative">
                  <label className="block text-sm font-medium text-white mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fccc63] focus:border-transparent resize-none text-white bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={credentials}
                  />
                  {field.key === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-10 text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Paste exported Instagram cookies (JSON):
                </label>
                <textarea
                  value={formData.cookies || ""}
                  onChange={(e) => handleInputChange("cookies", e.target.value)}
                  placeholder='[ { "name": "sessionid", "value": "...", ... }, ... ]'
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fccc63] focus:border-transparent resize-none text-white bg-transparent"
                  required
                  disabled={credentials}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || credentials}
              className="w-full bg-white/20 text-white py-3 px-4 rounded-xl font-medium hover:bg-white hover:text-[#dc6c6f] hover:z-30 hover:scale-102 shadow-lg transition-all duration-200 focus:ring-2 focus:ring-[#E1306C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 mt-8"
            >
              <>
                <Save size={20} />
                <span>Save Credentials</span>
              </>
            </button>

            {credentials && (
              <>
                <div className="p-4 rounded-lg">
                  <p className="flex items-center gap-2 text-green-800 font-medium">
                    <ShieldCheck size={20} /> Credentials saved successfully!
                  </p>
                  <p className="flex gap-1 text-green-800 text-sm mt-1">
                    If you want to interact with Instagram to check the session,
                    <span
                      className="flex items-center gap-1 text-[#bc2a8d] cursor-pointer"
                      onClick={handleInteraction}
                    >
                      click here <SendToBack size={15} />
                    </span>
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
      </section>
    </div>
  );
}
