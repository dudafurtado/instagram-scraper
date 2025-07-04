export interface BioLink {
  link_id: string
  url: string
  lynx_url: string
  link_type: string
  title: string
  media_type: string
  image_url: string
  icon_url: string
  is_pinned: boolean
  is_verified: boolean
  open_external_url_with_in_app_browser: boolean
  creation_source: string
}

interface BiographyWithEntities {
  raw_text: string
  entities: any[]
}

interface HdProfilePicVersion {
  height: number
  url: string
  width: number
}

interface NametagThemeColor {
  display_label: string
  int_value: number
}

interface NametagTheme {
  available_theme_colors: NametagThemeColor[]
  selected_theme_color: NametagThemeColor
}

interface Nametag {
  available_theme_colors: number[]
  background_image_url: string
  emoji: string
  emoji_color: number
  gradient: number
  is_background_image_blurred: boolean
  mode: number
  selected_theme_color: number
  selfie_sticker: number
  selfie_url: string
  theme_color: NametagTheme
}

interface ProfileOverlayInfo {
  bloks_payload: any
}

interface MetaVerifiedBenefitsInfo {
  active_meta_verified_benefits: any[]
  is_eligible_for_meta_verified_content_protection: boolean
}

interface NotMetaVerifiedFrictionInfo {
  label_friction_content: string
  is_eligible_for_label_friction: boolean
}

interface ReconFeatures {
  enable_recon_cta: boolean
}

interface RecsFromFriends {
  enable_recs_from_friends: boolean
  recs_from_friends_entry_point_type: string
}

interface HdProfilePicUrlInfo {
  height: number
  url: string
  width: number
}

export interface InfoUser {
  can_hide_category: boolean
  account_type: number
  ads_page_id: string | null
  ads_page_name: string | null
  current_catalog_id: string | null
  mini_shop_seller_onboarding_status: string | null
  ads_incentive_expiration_date: string | null
  primary_profile_link_type: number
  show_fb_link_on_profile: boolean
  show_fb_page_link_on_profile: boolean
  account_category: string
  can_add_fb_group_link_on_profile: boolean
  can_use_affiliate_partnership_messaging_as_creator: boolean
  can_use_affiliate_partnership_messaging_as_brand: boolean
  existing_user_age_collection_enabled: boolean
  fbid_v2: string
  feed_post_reshare_disabled: boolean
  full_name: string
  has_gen_ai_personas_for_profile_banner: boolean
  has_guides: boolean
  has_ig_profile: boolean
  has_nme_badge: boolean
  has_public_tab_threads: boolean
  highlight_reshare_disabled: boolean
  highlights_tray_type: string
  include_direct_blacklist_status: boolean
  is_direct_roll_call_enabled: boolean
  is_eligible_for_meta_verified_links_in_reels: boolean
  is_eligible_for_post_boost_mv_upsell: boolean
  is_meta_verified_related_accounts_display_enabled: boolean
  is_eligible_for_meta_verified_label: boolean
  is_new_to_instagram: boolean
  is_parenting_account: boolean
  is_private: boolean
  is_profile_broadcast_sharing_enabled: boolean
  is_recon_ad_cta_on_profile_eligible_with_viewer: boolean
  is_secondary_account_creation: boolean
  pk: string
  pk_id: string
  profile_type: number
  show_account_transparency_details: boolean
  show_post_insights_entry_point: boolean
  show_wa_link_on_profile: boolean
  third_party_downloads_enabled: number
  is_opal_enabled: boolean
  strong_id__: string
  has_ever_selected_topics: boolean
  is_auto_confirm_enabled_for_all_reciprocal_follow_requests: boolean
  is_active_on_text_post_app: boolean
  views_on_grid_status: string
  id: string
  can_hide_public_contacts: boolean
  category: string
  should_show_category: boolean
  category_id: string
  is_category_tappable: boolean
  should_show_public_contacts: boolean
  is_eligible_for_smb_support_flow: boolean
  is_eligible_for_lead_center: boolean
  lead_details_app_id: string
  is_business: boolean
  professional_conversion_suggested_account_type: number
  direct_messaging: string
  instagram_location_id: string
  address_street: string
  business_contact_method: string
  city_id: string
  city_name: string
  contact_phone_number: string
  is_profile_audio_call_enabled: boolean
  latitude: number
  longitude: number
  public_email: string
  public_phone_country_code: string
  public_phone_number: string
  zip: string
  displayed_action_button_partner: string | null
  smb_delivery_partner: string | null
  smb_support_delivery_partner: string | null
  displayed_action_button_type: string
  smb_support_partner: string | null
  is_call_to_action_enabled: boolean
  num_of_admined_pages: number | null
  page_id: string | null
  page_name: string | null
  shopping_post_onboard_nux_type: string | null
  biography: string
  biography_with_entities: BiographyWithEntities
  external_lynx_url: string
  external_url: string
  has_biography_translation: boolean
  account_badges: any[]
  additional_business_addresses: any[]
  allow_manage_memorialization: boolean
  auto_expand_chaining: boolean
  bio_links: BioLink[]
  birthday_today_visibility_for_viewer: string
  broadcast_chat_preference_status: {
    json_response: string
  }
  can_use_branded_content_discovery_as_brand: boolean
  can_use_branded_content_discovery_as_creator: boolean
  can_use_paid_partnership_messaging_as_creator: boolean
  chaining_upsell_cards: any[]
  creator_shopping_info: {
    linked_merchant_accounts: any[]
  }
  enable_add_school_in_edit_profile: boolean
  fan_club_info: any
  follow_friction_type: number
  follower_count: number
  following_count: number
  has_anonymous_profile_picture: boolean
  has_chaining: boolean
  has_collab_collections: boolean
  has_exclusive_feed_content: boolean
  has_fan_club_subscriptions: boolean
  has_highlight_reels: boolean
  has_igtv_series: boolean
  has_music_on_profile: boolean
  has_private_collections: boolean
  has_videos: boolean
  has_views_fetching: boolean
  hd_profile_pic_url_info: HdProfilePicUrlInfo
  hd_profile_pic_versions: HdProfilePicVersion[]
  interop_messaging_user_fbid: number
  instagram_pk: string
  is_bestie: boolean
  is_creator_agent_enabled: boolean
  is_profile_search_enabled: boolean
  is_eligible_for_diverse_owned_business_info: boolean
  meta_verified_benefits_info: MetaVerifiedBenefitsInfo
  is_eligible_for_meta_verified_enhanced_link_sheet: boolean
  is_eligible_for_meta_verified_enhanced_link_sheet_consumption: boolean
  is_eligible_for_meta_verified_multiple_addresses_creation: boolean
  is_eligible_for_meta_verified_multiple_addresses_consumption: boolean
  is_eligible_for_meta_verified_related_accounts: boolean
  meta_verified_related_accounts_count: number
  is_eligible_to_display_diverse_owned_business_info: boolean
  is_favorite: boolean
  is_favorite_for_stories: boolean
  is_favorite_for_clips: boolean
  is_favorite_for_highlights: boolean
  is_in_canada: boolean
  is_interest_account: boolean
  is_memorialized: boolean
  is_potential_business: boolean
  is_regulated_news_in_viewer_location: boolean
  is_remix_setting_enabled_for_posts: boolean
  is_remix_setting_enabled_for_reels: boolean
  is_prime_onboarding_account: boolean
  is_regulated_c18: boolean
  profile_overlay_info: ProfileOverlayInfo
  is_stories_teaser_muted: boolean
  is_supervision_features_enabled: boolean
  is_verified: boolean
  is_whatsapp_linked: boolean
  latest_besties_reel_media: number
  latest_reel_media: number
  live_subscription_status: string
  media_count: number
  merchant_checkout_style: string
  mutual_followers_count: number
  nametag: Nametag
  not_meta_verified_friction_info: NotMetaVerifiedFrictionInfo
  open_external_url_with_in_app_browser: boolean
  pinned_channels_info: {
    has_public_channels: boolean
    pinned_channels_list: any[]
  }
  profile_context: string
  profile_context_facepile_users: any[]
  profile_context_links_with_user_ids: any[]
  profile_pic_id: string
  profile_pic_url: string
  profile_pic_genai_tool_info: any[]
  pronouns: any[]
  recon_features: ReconFeatures
  relevant_news_regulation_locations: any[]
  remove_message_entrypoint: boolean
  seller_shoppable_feed_type: string
  show_blue_badge_on_main_profile: boolean
  show_schools_badge: boolean | null
  show_shoppable_feed: boolean
  disable_profile_shop_cta: boolean
  spam_follower_setting_enabled: boolean
  text_app_last_visited_time: string | null
  eligible_for_text_app_activation_badge: boolean
  total_ar_effects: number
  total_clips_count: number
  total_igtv_videos: number
  transparency_product_enabled: boolean
  username: string
  is_profile_picture_expansion_enabled: boolean
  recs_from_friends: RecsFromFriends
  adjusted_banners_order: any[]
  is_eligible_for_request_message: boolean
  trial_clips_enabled: boolean
  is_open_to_collab: boolean
  is_oregon_custom_gender_consented: boolean
  profile_reels_sorting_eligibility: string
  nonpro_can_maybe_see_profile_hypercard: boolean
  should_show_tagged_tab: boolean
  posts_subscription_status: string
  reels_subscription_status: string
  stories_subscription_status: string
  is_eligible_for_slide: boolean
  is_ring_creator: boolean
}
