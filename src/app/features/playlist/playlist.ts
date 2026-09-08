import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../core/services/video';
import { VizoraStoreService } from '../../core/services/vizora-store.service';
import { Video } from '../../core/models/video';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [],
  template: `
    <div class="playlist-page">
      <!-- Playlist Left Banner Card -->
      <aside class="playlist-sidebar">
        <div class="cover-box">
          <img [src]="playlistThumbnail()" alt="Playlist Thumbnail" />
          <span class="count-badge">{{ playlistVideos().length }} videos</span>
        </div>
        <h1 class="pl-title">{{ playlistTitle() }}</h1>
        <p class="pl-user">Mithra BR • {{ playlistVideos().length }} videos</p>
        <div class="pl-btn-row">
          <button class="play-all-btn" (click)="playFirst()">▶ Play all</button>
        </div>
      </aside>

      <!-- Playlist Video Items -->
      <main class="playlist-items">
        @if (playlistVideos().length === 0) {
          <div class="empty-list">No videos found in this playlist.</div>
        } @else {
          @for (video of playlistVideos(); track video.id; let i = $index) {
            <div class="playlist-row" (click)="openVideo(video.id)">
              <span class="index-num">{{ i + 1 }}</span>
              <div class="thumb-wrapper">
                <img [src]="video.thumbnailUrl" [alt]="video.title" />
                <span class="duration">{{ video.duration }}</span>
              </div>
              <div class="item-meta">
                <h4 class="title">{{ video.title }}</h4>
                <p class="channel">{{ video.channelName }}</p>
              </div>
            </div>
          }
        }
      </main>
    </div>
  `,
  styles: [`
    .playlist-page {
      display: flex;
      gap: 36px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px;

      @media (max-width: 900px) {
        flex-direction: column;
      }
    }

    .playlist-sidebar {
      width: 360px;
      flex-shrink: 0;
      background: linear-gradient(180deg, rgba(80, 50, 120, 0.4) 0%, rgba(20, 20, 20, 0.6) 100%);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #383838;

      @media (max-width: 900px) {
        width: 100%;
      }

      .cover-box {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 16px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .count-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          color: #fff;
        }
      }

      .pl-title {
        font-size: 24px;
        font-weight: 700;
        color: #f1f1f1;
        margin-bottom: 8px;
      }

      .pl-user {
        font-size: 13px;
        color: #aaa;
        margin-bottom: 16px;
      }

      .play-all-btn {
        background: #f1f1f1;
        color: #0f0f0f;
        border: none;
        padding: 10px 24px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          background: #d9d9d9;
        }
      }
    }

    .playlist-items {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .playlist-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background: #272727;
        }

        .index-num {
          font-size: 14px;
          color: #aaa;
          width: 20px;
          text-align: center;
        }

        .thumb-wrapper {
          position: relative;
          width: 140px;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
          background: #272727;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .duration {
            position: absolute;
            bottom: 4px;
            right: 4px;
            background: rgba(0, 0, 0, 0.85);
            font-size: 10px;
            font-weight: 600;
            padding: 1px 4px;
            border-radius: 4px;
            color: #fff;
          }
        }

        .item-meta {
          flex: 1;

          .title {
            font-size: 14px;
            font-weight: 500;
            color: #f1f1f1;
            margin-bottom: 4px;
          }

          .channel {
            font-size: 12px;
            color: #aaa;
          }
        }
      }

      .empty-list {
        padding: 40px 0;
        color: #aaa;
        font-size: 15px;
      }
    }
  `]
})
export class PlaylistComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoService = inject(VideoService);
  private store = inject(VizoraStoreService);

  playlistTitle = signal<string>('Liked videos');
  playlistThumbnail = signal<string>('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800');
  playlistVideos = signal<Video[]>([]);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((q) => {
      const listType = q.get('list');
      if (listType === 'LL') {
        this.playlistTitle.set('Liked videos');
        const likedIds = this.store.likedVideoIds();
        const found = this.videoService.homeVideos().filter((v) => likedIds.includes(v.id));
        this.playlistVideos.set(found.length ? found : this.videoService.homeVideos().slice(0, 3));
      } else if (listType === 'WL') {
        this.playlistTitle.set('Watch later');
        const wlIds = this.store.watchLaterIds();
        const found = this.videoService.homeVideos().filter((v) => wlIds.includes(v.id));
        this.playlistVideos.set(found.length ? found : this.videoService.homeVideos().slice(1, 4));
      } else {
        this.playlistTitle.set('Custom Playlist');
        this.playlistVideos.set(this.videoService.homeVideos().slice(0, 4));
      }

      const first = this.playlistVideos()[0];
      if (first && first.thumbnailUrl) {
        this.playlistThumbnail.set(first.thumbnailUrl);
      }
    });
  }

  playFirst(): void {
    const list = this.playlistVideos();
    if (list.length) {
      this.openVideo(list[0].id);
    }
  }

  openVideo(id: string): void {
    this.router.navigate(['/watch', id]);
  }
}