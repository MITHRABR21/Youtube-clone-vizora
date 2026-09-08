import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../core/services/video';
import { VizoraStoreService } from '../../core/services/vizora-store.service';
import { Video, ShortVideo } from '../../core/models/video';

export interface ChannelInfo {
  name: string;
  handle: string;
  avatar: string;
  bannerUrl: string;
  subscribers: string;
  videoCount: number;
  description: string;
  joinedDate: string;
}

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [],
  templateUrl: './channel.html',
  styleUrl: './channel.scss'
})
export class ChannelComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  videoService = inject(VideoService);
  store = inject(VizoraStoreService);

  activeTab = signal<'videos' | 'shorts' | 'about'>('videos');
  channel = signal<ChannelInfo | null>(null);
  channelVideos = signal<Video[]>([]);
  channelShorts = signal<ShortVideo[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const handle = params.get('handle') || 'Sun TV Official';
      this.loadChannelData(handle);
    });
  }

  loadChannelData(nameOrHandle: string): void {
    const formattedName = decodeURIComponent(nameOrHandle);

    this.channel.set({
      name: formattedName,
      handle: '@' + formattedName.toLowerCase().replace(/\s+/g, ''),
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(formattedName)}`,
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
      subscribers: '26.4M subscribers',
      videoCount: 1420,
      description: `Welcome to the official Vizora channel of ${formattedName}. Stream trailers, music videos, promos, and exclusive updates in full HD.`,
      joinedDate: 'Joined Jan 14, 2021'
    });

    const videos = this.videoService.homeVideos().filter(
      (v) => !v.isAd && (v.channelName.toLowerCase().includes(formattedName.toLowerCase()) || formattedName === 'Sun TV Official')
    );
    this.channelVideos.set(videos.length > 0 ? videos : this.videoService.homeVideos().filter((v) => !v.isAd));

    const shorts = this.videoService.shorts();
    this.channelShorts.set(shorts);
  }

  toggleSubscribe(): void {
    const ch = this.channel();
    if (!ch) return;
    this.store.toggleSubscription(ch.name);
  }

  openVideo(id: string): void {
    this.router.navigate(['/watch', id]);
  }

  openShort(id: string): void {
    this.router.navigate(['/shorts', id]);
  }
}