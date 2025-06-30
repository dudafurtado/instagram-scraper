export interface Credentials {
  sessionId: string;
  csrfToken: string;
  dsUserId: string;
  igAppId: string;
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
