export interface Credentials {
  username: string;
  password: string;
  search: string;
}

export interface User {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_verified?: boolean;
  is_private?: boolean;
}

export interface CollectionData {
  followers: User[];
  following: User[];
}

export interface ComparisonResult {
  notFollowedBack: User[];
  notFollowingBack: User[];
}

export interface VerificationResult {
  followersOk: boolean;
  followersFound: number;
  followingOk: boolean;
  followingFound: number;
}

export interface InstagramProfile {
  user_id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  follower_count: number;
  following_count: number;
  posts: number;
  is_private: boolean;
  is_verified: boolean;
  created_at?: string;
}

export interface CollectionJob {
  id: string;
  profile: InstagramProfile;
  status: "pending" | "collecting" | "completed" | "failed";
  progress: {
    followers_collected: number;
    following_collected: number;
    total_followers: number;
    total_following: number;
    images_downloaded: number;
    total_images: number;
  };
  started_at?: string;
  completed_at?: string;
  position_in_queue?: number;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface ComparisonData {
  youFollowButTheyDont: InstagramProfile[];
  theyFollowButYouDont: InstagramProfile[];
}
