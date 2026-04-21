export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  postedAt: string;
  duration: string;
  videoUrl: string;
  category: string;
  description?: string;
  subscriberCount?: string;
  isLive?: boolean;
}

export interface Category {
  id: string;
  name: string;
}
