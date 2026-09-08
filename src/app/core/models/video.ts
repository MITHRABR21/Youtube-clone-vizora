export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  uploadedAt: string;
  duration: string;
  category: string;
  language?: string;
  subscribers?: string;
  likes?: string;
  isAd?: boolean;
  isMix?: boolean;
  adSubtitle?: string;
  adActionUrl?: string;
}

export interface ShortVideo {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
  views: string;
  channelName: string;
  channelAvatar: string;
  likes: string;
  commentsCount: string;
}