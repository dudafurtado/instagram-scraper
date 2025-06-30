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
