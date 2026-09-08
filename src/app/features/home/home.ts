import { Component, HostListener, inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { VideoService } from '../../core/services/video';

@Component({
selector: 'app-home',
standalone: true,
imports: [],
templateUrl: './home.html',
styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

videoService = inject(VideoService);
router = inject(Router);

ngOnInit(): void {
if (!this.videoService.isSearching()) {
this.videoService.refreshRecommendationFeed();
}
}

/* =========================================================
CATEGORY SELECTION
========================================================= */

selectCategory(category: string): void {


this.videoService.selectedCategory.set(category);

if (category === 'All') {

  this.videoService.isSearching.set(false);
  this.videoService.searchQuery.set('');
  this.videoService.searchResults.set([]);

  this.videoService.refreshRecommendationFeed();

  return;
}

const categorySearchTerms: Record<string, string> = {

  'Tamil Cinema':
    'Tamil cinema movie scenes songs',

  'Music':
    'Tamil songs music',

  'Tamil Melodies':
    'Tamil melody songs',

  'Trailers':
    'Tamil movie trailers',

  'Telugu Cinema':
    'Telugu cinema movies',

  'Hindi Cinema':
    'Hindi cinema movies',

  'News':
    'India latest news',

  'Comedy':
    'Tamil comedy',

  'Gaming':
    'gaming videos'

};

const searchTerm =
  categorySearchTerms[category] || category;

this.videoService.performSearch(searchTerm);


}

/* =========================================================
OPEN VIDEO
========================================================= */

openVideo(id: string): void {
this.router.navigate(['/watch', id]);
}

/* =========================================================
OPEN SHORT
========================================================= */

openShort(id: string): void {
this.router.navigate(['/shorts', id]);
}

/* =========================================================
SEARCH LOAD MORE
========================================================= */

loadMore(): void {
this.videoService.loadMoreSearchResults();
}

/* =========================================================
HOME INFINITE SCROLL
========================================================= */

@HostListener('window:scroll', [])
onWindowScroll(): void {


/*
 * Do not load Home pages while the user is searching.
 * Search has its own pagination.
 */

if (this.videoService.isSearching()) {
  return;
}

/*
 * Prevent another request while the current
 * Home API request is still loading.
 */

if (this.videoService.isHomeLoading()) {
  return;
}

/*
 * Stop when YouTube has no more pages.
 */

if (!this.videoService.hasMoreHomeVideos()) {
  return;
}

/*
 * Start loading the next page when the user
 * is approximately 800px from the bottom.
 */

const scrollPosition =
  window.innerHeight + window.scrollY;

const pageHeight =
  document.documentElement.scrollHeight;

const distanceFromBottom =
  pageHeight - scrollPosition;

if (distanceFromBottom <= 800) {

  this.videoService.loadMoreHomeVideos();

}


}
}
