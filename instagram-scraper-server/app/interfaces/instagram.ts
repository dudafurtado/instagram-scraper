export interface InstagramCredentials {
  username: string
  password: string
}

export interface InstagramUser {
  pk: string
  pk_id: string
  id: string
  full_name: string
  is_private: boolean
  fbid_v2: string
  third_party_downloads_enabled: number
  strong_id__: string
  profile_pic_id: string
  profile_pic_url: string
  is_verified: boolean
  username: string
  has_anonymous_profile_picture: boolean
  account_badges: any[]
  latest_reel_media: number
}

export interface SimplifiedInstagramUser {
  id: string
  full_name: string
  profile_pic_url: string
  username: string
}

export interface ScraperUser {
  user_id: string

  username: string
  full_name: string
  biography: string[]
  urls: string[]
  profile_pic_url: string | null

  posts: string
  follower_count: number
  following_count: number

  is_private: boolean
  is_bestie: boolean

  address_street: string
  city_name: string
  contact_phone_number: string
  public_email: string
  public_phone_number: string
}

export interface Session {
  username: string
  password: string
  session_id: string
  csrf_token: string
  ds_user_id: string
  ig_app_id: string
  created_at: string
  expired_at: string | null
}
