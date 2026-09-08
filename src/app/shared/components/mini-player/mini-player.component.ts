import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VizoraStoreService } from '../../../core/services/vizora-store.service';

@Component({
  selector: 'app-mini-player',
  standalone: true,
  imports: [],
  template: `
    @if (store.activePlayback(); as active) {
      @if (active.isMiniPlayer && !isOnWatchPage()) {
        <div class="mini-player-container">
          <div class="mini-player-card">
            <div class="media-box" (click)="expand(active.video.id)">
              <iframe 
                [src]="getEmbedUrl(active.video.youtubeId)"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                class="iframe-media">
              </iframe>
            </div>
            <div class="info-box" (click)="expand(active.video.id)">
              <span class="video-title">{{ active.video.title }}</span>
              <span class="channel-title">{{ active.video.channelName }}</span>
            </div>
            <div class="controls-box">
              <button class="ctrl-btn" (click)="store.closeMiniPlayer()" title="Close">✕</button>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .mini-player-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1500;
      width: 380px;
      background-color: #212121;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
      border: 1px solid #383838;
      transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        transform: translateY(-4px);
      }
    }

    .mini-player-card {
      display: flex;
      align-items: center;
      height: 72px;
    }

    .media-box {
      width: 128px;
      height: 100%;
      background: #000;
      flex-shrink: 0;
      cursor: pointer;

      .iframe-media {
        width: 100%;
        height: 100%;
        border: none;
      }
    }

    .info-box {
      flex: 1;
      padding: 0 12px;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      cursor: pointer;

      .video-title {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .channel-title {
        font-size: 11px;
        color: #aaa;
      }
    }

    .controls-box {
      padding-right: 12px;

      .ctrl-btn {
        background: transparent;
        border: none;
        color: #aaa;
        font-size: 16px;
        cursor: pointer;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        &:hover {
          background-color: #383838;
          color: #fff;
        }
      }
    }
  `]
})
export class MiniPlayerComponent {
  store = inject(VizoraStoreService);
  router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  isOnWatchPage(): boolean {
    return this.router.url.startsWith('/watch');
  }

  getEmbedUrl(youtubeId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`
    );
  }

  expand(videoId: string): void {
    this.router.navigate(['/watch', videoId]);
  }
}