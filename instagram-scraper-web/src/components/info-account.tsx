import {
  Users,
  ImageIcon,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { ScraperUser } from "@/types";

export default function InfoAccountDetail({
  user_id,
  full_name,
  username,
  biography,
  urls,
  follower_count,
  following_count,
  posts,
  address_street,
  public_email,
  public_phone_number,
}: ScraperUser) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture - Left Side */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <div className="relative">
            <img
              src={`http://localhost:3333/img/${user_id}_${username}.jpg`}
              alt={`${username} profile picture`}
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Profile Info - Right Side */}
        <div className="flex-1 space-y-4 text-white">
          {/* Name and Username */}
          <div className="space-y-1">
            <h1 className="text-xl md:text-xl font-bold">{full_name}</h1>
            <p className="text-md text-white/90">@{username}</p>
          </div>

          {/* Biography */}
          {biography.length > 0 && (
            <div className="space-y-1">
              {biography.map((line, index) => (
                <p key={index} className="text-white/90 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* URLs */}
          {urls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {urls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  <ExternalLink size={14} />
                  <span className="truncate max-w-32">
                    {url.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-white/80" />
              <span className="font-semibold">
                {formatNumber(follower_count)}
              </span>
              <span className="text-white/80 text-sm">followers</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-white/80" />
              <span className="font-semibold">
                {formatNumber(following_count)}
              </span>
              <span className="text-white/80 text-sm">following</span>
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-white/80" />
              <span className="font-semibold">
                {formatNumber(Number(posts))}
              </span>
              <span className="text-white/80 text-sm">posts</span>
            </div>
          </div>

          {/* Optional Contact Info */}
          <div className="space-y-2">
            {address_street && (
              <div className="flex items-center gap-2 text-white/90">
                <MapPin size={16} className="text-white/70 flex-shrink-0" />
                <span className="text-sm">{address_street}</span>
              </div>
            )}

            {public_email && (
              <div className="flex items-center gap-2 text-white/90">
                <Mail size={16} className="text-white/70 flex-shrink-0" />
                <a
                  href={`mailto:${public_email}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {public_email}
                </a>
              </div>
            )}

            {public_phone_number && (
              <div className="flex items-center gap-2 text-white/90">
                <Phone size={16} className="text-white/70 flex-shrink-0" />
                <a
                  href={`tel:${public_phone_number}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {public_phone_number}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
