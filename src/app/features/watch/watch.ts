import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../core/services/video';
import { VizoraStoreService } from '../../core/services/vizora-store.service';
import { UiService } from '../../core/services/ui';
import { Video } from '../../core/models/video';

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: number;
}

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './watch.html',
  styleUrl: './watch.scss'
})
export class WatchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  
  videoService = inject(VideoService);
  store = inject(VizoraStoreService);
  uiService = inject(UiService);

  currentVideo = signal<Video | undefined>(undefined);
  safeEmbedUrl = signal<SafeResourceUrl | undefined>(undefined);
  isTheaterMode = signal<boolean>(false);
  likeCount = signal<number>(45200);

  // Computed signals that bind to template checks
  isLiked = computed(() => {
    const v = this.currentVideo();
    return v ? this.store.isLiked(v.id) : false;
  });

  isSubscribed = computed(() => {
    const v = this.currentVideo();
    return v ? this.store.isSubscribed(v.channelName) : false;
  });

  newCommentText = signal<string>('');
  comments = signal<Comment[]>([
    {
      id: 'c1',
      user: 'Karthik_99',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Karthik',
      timeAgo: '1 day ago',
      text: 'The streaming speed and dark mode parity on Vizora are unmatched!',
      likes: 82
    },
    {
      id: 'c2',
      user: 'CinemaBuff',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CinemaBuff',
      timeAgo: '4 hours ago',
      text: 'Having Tamil songs, Bigg Boss, and college web series together is incredible.',
      likes: 24
    }
  ]);

  ngOnInit(): void {
    this.uiService.isSidebarOpen.set(false);
    this.store.closeMiniPlayer();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const found = this.videoService.getVideoById(id);
        if (found) {
          this.currentVideo.set(found);
          this.videoService.recordWatchInteraction(found);
          this.store.addToHistory(found);

          const rawUrl = `https://www.youtube.com/embed/${found.youtubeId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1`;
          this.safeEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.uiService.isSidebarOpen.set(true);
    const current = this.currentVideo();
    if (current) {
      this.store.setMiniPlayer(current);
    }
  }

  toggleLike(): void {
    const video = this.currentVideo();
    if (!video) return;

    const isNowLiked = this.store.toggleLike(video.id);
    this.likeCount.update((count) => (isNowLiked ? count + 1 : count - 1));
  }

  toggleDislike(): void {
    const video = this.currentVideo();
    if (!video) return;
    this.store.toggleDislike(video.id);
  }

  toggleSubscribe(): void {
    const video = this.currentVideo();
    if (!video) return;
    this.store.toggleSubscription(video.channelName);
  }

  toggleTheater(): void {
    this.isTheaterMode.update((v) => !v);
  }

  selectSuggestedVideo(id: string): void {
    this.router.navigate(['/watch', id]);
  }

  onCommentInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newCommentText.set(input.value);
  }

  addComment(inputRef: HTMLInputElement): void {
    const text = this.newCommentText().trim();
    if (!text) return;

    const newComment: Comment = {
      id: 'c' + Date.now(),
      user: 'Mithra BR',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mithra',
      timeAgo: 'Just now',
      text: text,
      likes: 0
    };

    this.comments.update((prev) => [newComment, ...prev]);
    inputRef.value = '';
    this.newCommentText.set('');
  }
}