import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../core/services/video';
import { UiService } from '../../core/services/ui';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  videoService = inject(VideoService);
  uiService = inject(UiService);
  router = inject(Router);

  searchQuery = '';

  toggleSidebar(): void {
    this.uiService.toggleSidebar();
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.videoService.performSearch(query);
      this.router.navigate(['/']);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.videoService.isSearching.set(false);
    this.videoService.searchQuery.set('');
    this.videoService.refreshRecommendationFeed();
    this.router.navigate(['/']);
  }
}