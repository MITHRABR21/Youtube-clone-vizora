import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { VizoraStoreService } from '../../core/services/vizora-store.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  template: `
    <div class="history-page">
      <div class="history-main">
        <h1 class="page-heading">Watch history</h1>

        @if (store.history().length === 0) {
          <div class="empty-state">
            <p>This list has no videos. Videos you watch will show up here.</p>
          </div>
        } @else {
          <div class="history-list">
            @for (video of store.history(); track video.id) {
              <div class="history-item">
                <div class="thumb-wrapper" (click)="openVideo(video.id)">
                  <img [src]="video.thumbnailUrl" [alt]="video.title" />
                  <span class="duration">{{ video.duration }}</span>
                </div>
                <div class="item-meta">
                  <div class="title-row">
                    <h3 class="video-title" (click)="openVideo(video.id)">{{ video.title }}</h3>
                    <button class="remove-btn" (click)="store.removeFromHistory(video.id)" title="Remove">✕</button>
                  </div>
                  <p class="channel-name">{{ video.channelName }} • {{ video.views }}</p>
                  <p class="video-desc">{{ video.description }}</p>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <aside class="history-sidebar">
        <button class="action-row" (click)="store.clearHistory()">
          <span>🗑</span>
          <span>Clear all watch history</span>
        </button>
      </aside>
    </div>
  `,
  styles: [`
    .history-page {
      display: flex;
      gap: 36px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px;

      @media (max-width: 900px) {
        flex-direction: column;
      }
    }

    .history-main {
      flex: 1;

      .page-heading {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 24px;
        color: #f1f1f1;
      }
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .history-item {
      display: flex;
      gap: 16px;

      .thumb-wrapper {
        position: relative;
        width: 240px;
        aspect-ratio: 16 / 9;
        border-radius: 8px;
        overflow: hidden;
        background: #272727;
        flex-shrink: 0;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .duration {
          position: absolute;
          bottom: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.8);
          font-size: 11px;
          font-weight: 600;
          padding: 1px 4px;
          border-radius: 4px;
          color: #fff;
        }
      }

      .item-meta {
        flex: 1;
        min-width: 0;

        .title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;

          .video-title {
            font-size: 16px;
            font-weight: 500;
            color: #f1f1f1;
            cursor: pointer;
            line-height: 1.35;
          }

          .remove-btn {
            background: transparent;
            border: none;
            color: #aaa;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;

            &:hover {
              color: #fff;
            }
          }
        }

        .channel-name {
          font-size: 13px;
          color: #aaa;
          margin: 6px 0;
        }

        .video-desc {
          font-size: 12px;
          color: #888;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
        }
      }
    }

    .history-sidebar {
      width: 280px;

      .action-row {
        display: flex;
        align-items: center;
        gap: 12px;
        background: transparent;
        border: none;
        color: #f1f1f1;
        font-size: 14px;
        cursor: pointer;
        padding: 10px 14px;
        border-radius: 8px;
        width: 100%;

        &:hover {
          background: #272727;
        }
      }
    }

    .empty-state {
      padding: 60px 0;
      color: #aaa;
      font-size: 15px;
    }
  `]
})
export class HistoryComponent {
  store = inject(VizoraStoreService);
  router = inject(Router);

  openVideo(id: string): void {
    this.router.navigate(['/watch', id]);
  }
}