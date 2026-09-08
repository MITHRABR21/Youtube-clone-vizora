import { Component, inject, signal, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../core/services/video';
import { ShortVideo } from '../../core/models/video';

@Component({
  selector: 'app-shorts',
  standalone: true,
  imports: [],
  templateUrl: './shorts.html',
  styleUrl: './shorts.scss'
})
export class ShortsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  videoService = inject(VideoService);

  currentShort = signal<ShortVideo | undefined>(undefined);
  safeEmbedUrl = signal<SafeResourceUrl | undefined>(undefined);
  isLiked = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') || 's1';
      const found = this.videoService.getShortById(id) || this.videoService.shorts()[0];

      if (found) {
        this.currentShort.set(found);
        const rawUrl = `https://www.youtube.com/embed/${found.youtubeId}?autoplay=1&loop=1&playlist=${found.youtubeId}&controls=0&modestbranding=1`;
        this.safeEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl));
      }
    });
  }

  toggleLike(): void {
    this.isLiked.update((liked) => !liked);
  }

  nextShort(): void {
    const list = this.videoService.shorts();
    const currentIndex = list.findIndex((s) => s.id === this.currentShort()?.id);
    const nextIndex = (currentIndex + 1) % list.length;
    this.router.navigate(['/shorts', list[nextIndex].id]);
  }
}