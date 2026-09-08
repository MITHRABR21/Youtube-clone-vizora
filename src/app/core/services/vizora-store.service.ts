import { Injectable, signal, effect } from '@angular/core';
import { Video } from '../models/video';

export interface Playlist {
  id: string;
  title: string;
  videoIds: string[];
  thumbnailUrl?: string;
  updatedAt: string;
  isPrivate: boolean;
}

export interface ActivePlayback {
  video: Video;
  currentTime: number;
  isPlaying: boolean;
  isMiniPlayer: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VizoraStoreService {
  private readonly PREFIX = 'vizora_';

  readonly history = signal<Video[]>(this.readStorage('history', []));
  readonly likedVideoIds = signal<string[]>(this.readStorage('liked_ids', []));
  readonly dislikedVideoIds = signal<string[]>(this.readStorage('disliked_ids', []));
  readonly watchLaterIds = signal<string[]>(this.readStorage('watch_later_ids', []));
  readonly subscribedChannels = signal<string[]>(
    this.readStorage('subscribed_channels', ['Sun TV Official', 'T-Series', 'WB Kids'])
  );

  readonly activePlayback = signal<ActivePlayback | null>(null);

  constructor() {
    effect(() => this.writeStorage('history', this.history()));
    effect(() => this.writeStorage('liked_ids', this.likedVideoIds()));
    effect(() => this.writeStorage('disliked_ids', this.dislikedVideoIds()));
    effect(() => this.writeStorage('watch_later_ids', this.watchLaterIds()));
    effect(() => this.writeStorage('subscribed_channels', this.subscribedChannels()));
  }

  addToHistory(video: Video): void {
    this.history.update((list) => {
      const filtered = list.filter((v) => v.id !== video.id && v.youtubeId !== video.youtubeId);
      return [video, ...filtered].slice(0, 50);
    });
  }

  removeFromHistory(id: string): void {
    this.history.update((list) => list.filter((v) => v.id !== id && v.youtubeId !== id));
  }

  clearHistory(): void {
    this.history.set([]);
  }

  toggleLike(videoId: string): boolean {
    let liked = false;
    this.likedVideoIds.update((ids) => {
      if (ids.includes(videoId)) {
        return ids.filter((id) => id !== videoId);
      }
      liked = true;
      return [videoId, ...ids];
    });

    if (liked) {
      this.dislikedVideoIds.update((ids) => ids.filter((id) => id !== videoId));
    }
    return liked;
  }

  isLiked(videoId: string): boolean {
    return this.likedVideoIds().includes(videoId);
  }

  toggleDislike(videoId: string): void {
    this.dislikedVideoIds.update((ids) => {
      if (ids.includes(videoId)) {
        return ids.filter((id) => id !== videoId);
      }
      return [videoId, ...ids];
    });
    this.likedVideoIds.update((ids) => ids.filter((id) => id !== videoId));
  }

  isDisliked(videoId: string): boolean {
    return this.dislikedVideoIds().includes(videoId);
  }

  toggleSubscription(channel: string): boolean {
    let subbed = false;
    this.subscribedChannels.update((channels) => {
      if (channels.includes(channel)) {
        return channels.filter((c) => c !== channel);
      }
      subbed = true;
      return [channel, ...channels];
    });
    return subbed;
  }

  isSubscribed(channel: string): boolean {
    return this.subscribedChannels().includes(channel);
  }

  setMiniPlayer(video: Video | null): void {
    if (!video) {
      this.activePlayback.set(null);
      return;
    }
    this.activePlayback.set({
      video,
      currentTime: 0,
      isPlaying: true,
      isMiniPlayer: true
    });
  }

  closeMiniPlayer(): void {
    this.activePlayback.set(null);
  }

  private readStorage<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  private writeStorage(key: string, val: unknown): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(val));
    } catch {}
  }
}