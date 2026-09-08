import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video, ShortVideo } from '../models/video';
import { environment } from '../../../environment/environment';

@Injectable({
providedIn: 'root'
})
export class VideoService {

private readonly http = inject(HttpClient);

private readonly YOUTUBE_API_KEY = environment.youtubeApiKey;

private readonly YOUTUBE_API_URL =
'https://www.googleapis.com/youtube/v3';

// =========================================================
// PAGINATION
// =========================================================

private nextPageToken = '';
private homeNextPageToken = '';

// =========================================================
// CATEGORIES
// =========================================================

readonly categories = signal<string[]>([
'All',
'Tamil Cinema',
'Music',
'Tamil Melodies',
'Trailers',
'Telugu Cinema',
'Hindi Cinema',
'News',
'Comedy',
'Gaming'
]);

readonly selectedCategory = signal('All');

// =========================================================
// SEARCH
// =========================================================

readonly searchQuery = signal('');
readonly isSearching = signal(false);
readonly searchResults = signal<Video[]>([]);

// =========================================================
// HOME
// =========================================================

readonly homeVideos = signal<Video[]>([]);
readonly isHomeLoading = signal(false);
readonly hasMoreHomeVideos = signal(true);

readonly isLoading = signal(false);

readonly videos = this.homeVideos;

// =========================================================
// SHORTS
// =========================================================

readonly shorts = signal<ShortVideo[]>([]);
readonly secondShorts = signal<ShortVideo[]>([]);

readonly isShortsLoading = signal(false);

// =========================================================
// STATIC THUMBNAIL
// =========================================================

private createStaticThumbnail(
title: string,
category: string,
label: string
): string {


const svg = `
  <svg xmlns="http://www.w3.org/2000/svg"
       width="640"
       height="360"
       viewBox="0 0 640 360">

    <defs>
      <linearGradient id="bg"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1">

        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#1f2937"/>

      </linearGradient>
    </defs>

    <rect
      width="640"
      height="360"
      fill="url(#bg)"
    />

    <circle
      cx="320"
      cy="150"
      r="52"
      fill="#ef4444"
    />

    <polygon
      points="305,120 305,180 355,150"
      fill="white"
    />

    <text
      x="320"
      y="245"
      text-anchor="middle"
      fill="white"
      font-size="25"
      font-family="Arial"
      font-weight="bold">
      ${this.escapeSvgText(label)}
    </text>

    <text
      x="320"
      y="285"
      text-anchor="middle"
      fill="#d1d5db"
      font-size="16"
      font-family="Arial">
      ${this.escapeSvgText(category)}
    </text>

  </svg>
`;

return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;


}

private escapeSvgText(value: string): string {


return value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');


}

// =========================================================
// FALLBACK VIDEOS
// =========================================================

private readonly youtubeDatabase: Video[] = [


{
  id: 'yt_ts_1',
  youtubeId: 'yt_ts_1',
  title: 'Tamil Latest Songs | Tamil Music Collection',
  description: 'Tamil music and latest songs',
  thumbnailUrl:
    'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
  channelName: 'Tamil Music',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Tamil%20Music',
  views: '1.2M views',
  uploadedAt: '2 days ago',
  duration: '4:32',
  category: 'Music',
  language: 'Tamil',
  likes: '48K'
},

{
  id: 'yt_ts_2',
  youtubeId: 'yt_ts_2',
  title: 'Tamil Melody Hits | Best Tamil Melodies',
  description: 'Beautiful Tamil melody songs',
  thumbnailUrl:
    'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
  channelName: 'Tamil Melodies',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Tamil%20Melodies',
  views: '850K views',
  uploadedAt: '4 days ago',
  duration: '5:18',
  category: 'Tamil Melodies',
  language: 'Tamil',
  likes: '31K'
},

{
  id: 'yt_ts_3',
  youtubeId: 'yt_ts_3',
  title: 'Latest Tamil Cinema Updates',
  description:
    'Tamil cinema latest updates and entertainment news',
  thumbnailUrl: this.createStaticThumbnail(
    'Latest Tamil Cinema',
    'Tamil Cinema',
    'CINEMA'
  ),
  channelName: 'Vizora Cinema',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Vizora%20Cinema',
  views: '420K views',
  uploadedAt: '1 day ago',
  duration: '8:24',
  category: 'Tamil Cinema',
  language: 'Tamil',
  likes: '18K'
},

{
  id: 'yt_ts_4',
  youtubeId: 'yt_ts_4',
  title: 'Tamil Movie Trailer | Latest Release',
  description: 'Latest Tamil movie trailer',
  thumbnailUrl: this.createStaticThumbnail(
    'Tamil Movie Trailer',
    'Trailers',
    'TRAILER'
  ),
  channelName: 'Tamil Trailers',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Tamil%20Trailers',
  views: '2.1M views',
  uploadedAt: '3 days ago',
  duration: '2:45',
  category: 'Trailers',
  language: 'Tamil',
  likes: '74K'
},

{
  id: 'yt_ts_5',
  youtubeId: 'yt_ts_5',
  title: 'Tamil Comedy Videos | Funniest Moments',
  description: 'Tamil comedy and entertainment',
  thumbnailUrl: this.createStaticThumbnail(
    'Tamil Comedy',
    'Comedy',
    'COMEDY'
  ),
  channelName: 'Tamil Comedy',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Tamil%20Comedy',
  views: '690K views',
  uploadedAt: '5 days ago',
  duration: '10:12',
  category: 'Comedy',
  language: 'Tamil',
  likes: '27K'
},

{
  id: 'yt_ts_9',
  youtubeId: 'yt_ts_9',
  title: 'Tamil Entertainment Videos',
  description:
    'Entertainment videos from Tamil creators',
  thumbnailUrl: this.createStaticThumbnail(
    'Tamil Entertainment',
    'Entertainment',
    'VIZORA'
  ),
  channelName: 'Vizora Entertainment',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Vizora%20Entertainment',
  views: '540K views',
  uploadedAt: '1 week ago',
  duration: '6:41',
  category: 'Tamil Cinema',
  language: 'Tamil',
  likes: '22K'
}


];

// =========================================================
// SHORTS FALLBACK
// =========================================================

private readonly shortsFeed: ShortVideo[] = [


{
  id: 'sh_1',
  youtubeId: 'sh_1',
  title: 'Tamil Cinema Trending Moment',
  thumbnailUrl: this.createStaticThumbnail(
    'Tamil Trending',
    'Shorts',
    'SHORTS'
  ),
  channelName: 'Vizora Shorts',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Vizora%20Shorts',
  views: '1.1M views',
  likes: '45K',
  commentsCount: '1.2K'
},

{
  id: 'sh_2',
  youtubeId: 'sh_2',
  title: 'Best Tamil Music Moment',
  thumbnailUrl: this.createStaticThumbnail(
    'Tamil Music',
    'Shorts',
    'MUSIC'
  ),
  channelName: 'Tamil Music Shorts',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Tamil%20Music%20Shorts',
  views: '780K views',
  likes: '32K',
  commentsCount: '840'
},

{
  id: 'sh_3',
  youtubeId: 'sh_3',
  title: 'Funny Tamil Comedy Moment',
  thumbnailUrl: this.createStaticThumbnail(
    'Tamil Comedy',
    'Shorts',
    'FUN'
  ),
  channelName: 'Comedy Shorts',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Comedy%20Shorts',
  views: '920K views',
  likes: '38K',
  commentsCount: '970'
},

{
  id: 'sh_4',
  youtubeId: 'sh_4',
  title: 'Latest Trending Short',
  thumbnailUrl: this.createStaticThumbnail(
    'Trending',
    'Shorts',
    'TRENDING'
  ),
  channelName: 'Trending Shorts',
  channelAvatar:
    'https://api.dicebear.com/7.x/initials/svg?seed=Trending%20Shorts',
  views: '640K views',
  likes: '26K',
  commentsCount: '620'
}


];

// =========================================================
// CONSTRUCTOR
// =========================================================

constructor() {
this.refreshRecommendationFeed();
}

// =========================================================
// USER AFFINITY
// =========================================================

private updateUserAffinity(video: Video): void {


try {

  const stored =
    localStorage.getItem(
      'vizora_user_affinity'
    );

  const affinity: Record<string, number> =
    stored
      ? JSON.parse(stored)
      : {};

  const category =
    video.category || 'Entertainment';

  affinity[category] =
    (affinity[category] || 0) + 1;

  localStorage.setItem(
    'vizora_user_affinity',
    JSON.stringify(affinity)
  );

} catch {

  // Ignore localStorage errors

}


}

registerVideoWatch(video: Video): void {
this.updateUserAffinity(video);
}

recordWatchInteraction(video: Video): void {
this.updateUserAffinity(video);
}

// =========================================================
// HTML DECODE
// =========================================================

private decodeHtml(value: string): string {


const textarea =
  document.createElement('textarea');

textarea.innerHTML = value;

return textarea.value;


}

// =========================================================
// HOME REFRESH
// =========================================================

refreshRecommendationFeed(): void {


this.homeNextPageToken = '';

this.hasMoreHomeVideos.set(true);

this.homeVideos.set([]);

/*
 * Temporary fallback while real Shorts are loading.
 * The real YouTube Shorts will replace these once loaded.
 */
this.shorts.set([
  ...this.shortsFeed
]);

this.secondShorts.set([
  ...this.shortsFeed
].reverse());

this.loadHomeVideos(true);

this.loadYouTubeShorts();


}

// =========================================================
// LOAD HOME VIDEOS
// =========================================================

loadHomeVideos(reset = false): void {


if (this.isHomeLoading()) {
  return;
}

if (
  !reset &&
  !this.hasMoreHomeVideos()
) {
  return;
}

this.isHomeLoading.set(true);

const params: Record<string, string | number> = {

  part: 'snippet',

  maxResults: 25,

  q: 'Tamil India entertainment music cinema',

  type: 'video',

  videoEmbeddable: 'true',

  videoSyndicated: 'true',

  regionCode: 'IN',

  order: 'relevance',

  key: this.YOUTUBE_API_KEY

};

if (
  !reset &&
  this.homeNextPageToken
) {

  params['pageToken'] =
    this.homeNextPageToken;
}

console.log(
  'Vizora Home API request'
);

this.http
  .get<any>(
    `${this.YOUTUBE_API_URL}/search`,
    {
      params
    }
  )
  .subscribe({

    next: (response) => {

      const items =
        response?.items || [];

      this.homeNextPageToken =
        response?.nextPageToken || '';

      this.hasMoreHomeVideos.set(
        !!this.homeNextPageToken
      );

      const videoIds =
        items
          .map(
            (item: any) =>
              item?.id?.videoId
          )
          .filter(
            (id: string | undefined) =>
              !!id
          );

      if (!videoIds.length) {

        this.isHomeLoading.set(false);

        if (
          reset &&
          this.homeVideos().length === 0
        ) {

          this.homeVideos.set([
            ...this.youtubeDatabase
          ]);

        }

        return;
      }

      this.getHomeVideoDetails(
        videoIds,
        items
      );
    },

    error: (error) => {

      console.error(
        'Vizora Home API error:',
        error
      );

      this.isHomeLoading.set(false);

      if (
        reset &&
        this.homeVideos().length === 0
      ) {

        this.homeVideos.set([
          ...this.youtubeDatabase
        ]);

      }

    }

  });


}

// =========================================================
// HOME VIDEO DETAILS
// =========================================================

private getHomeVideoDetails(
videoIds: string[],
searchItems: any[]
): void {


const params = {

  part:
    'snippet,statistics,contentDetails',

  id:
    videoIds.join(','),

  key:
    this.YOUTUBE_API_KEY

};

this.http
  .get<any>(
    `${this.YOUTUBE_API_URL}/videos`,
    {
      params
    }
  )
  .subscribe({

    next: (response) => {

      const details =
        response?.items || [];

      const videos: Video[] =
        details.map(
          (item: any) => {

            const snippet =
              item?.snippet || {};

            const statistics =
              item?.statistics || {};

            const contentDetails =
              item?.contentDetails || {};

            const searchItem =
              searchItems.find(
                (result: any) =>
                  result?.id?.videoId ===
                  item.id
              );

            const thumbnailUrl =
              snippet?.thumbnails?.maxres?.url ||
              snippet?.thumbnails?.standard?.url ||
              snippet?.thumbnails?.high?.url ||
              snippet?.thumbnails?.medium?.url ||
              snippet?.thumbnails?.default?.url ||
              searchItem?.snippet?.thumbnails?.high?.url ||
              searchItem?.snippet?.thumbnails?.medium?.url ||
              this.createStaticThumbnail(
                snippet?.title ||
                  'Vizora Video',
                'YouTube',
                'VIZORA'
              );

            const title =
              this.decodeHtml(
                snippet?.title ||
                  'Untitled Video'
              );

            const description =
              this.decodeHtml(
                snippet?.description ||
                  ''
              );

            const channelName =
              snippet?.channelTitle ||
              'YouTube Creator';

            return {

              id:
                item.id,

              youtubeId:
                item.id,

              title,

              description,

              thumbnailUrl,

              channelName,

              channelAvatar:
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  channelName
                )}`,

              views:
                this.formatCount(
                  statistics?.viewCount
                ),

              uploadedAt:
                this.formatPublishedDate(
                  snippet?.publishedAt
                ),

              duration:
                this.parseYouTubeDuration(
                  contentDetails?.duration
                ),

              category:
                this.getHomeCategory(
                  title,
                  description
                ),

              language: 'Tamil',

              likes:
                this.formatCount(
                  statistics?.likeCount
                )

            };
          }
        );

      const cleanVideos =
        this.removeDuplicateVideos(
          videos
        );

      const mergedVideos =
        this.removeDuplicateVideos([
          ...this.homeVideos(),
          ...cleanVideos
        ]);

      this.homeVideos.set(
        mergedVideos
      );

      this.isHomeLoading.set(false);

      console.log(
        'Vizora Home videos loaded:',
        cleanVideos.length,
        'Total:',
        mergedVideos.length
      );

    },

    error: (error) => {

      console.error(
        'Vizora Home details error:',
        error
      );

      this.isHomeLoading.set(false);

    }

  });


}

// =========================================================
// HOME CATEGORY
// =========================================================

private getHomeCategory(
title: string,
description: string
): string {


const text =
  `${title} ${description}`.toLowerCase();

if (
  text.includes('trailer') ||
  text.includes('teaser')
) {
  return 'Trailers';
}

if (
  text.includes('comedy') ||
  text.includes('funny')
) {
  return 'Comedy';
}

if (
  text.includes('gaming') ||
  text.includes('gameplay') ||
  text.includes('gamer')
) {
  return 'Gaming';
}

if (
  text.includes('news') ||
  text.includes('breaking')
) {
  return 'News';
}

if (text.includes('telugu')) {
  return 'Telugu Cinema';
}

if (
  text.includes('hindi') ||
  text.includes('bollywood')
) {
  return 'Hindi Cinema';
}

if (
  text.includes('melody') ||
  text.includes('melodies')
) {
  return 'Tamil Melodies';
}

if (
  text.includes('song') ||
  text.includes('music') ||
  text.includes('audio')
) {
  return 'Music';
}

if (
  text.includes('movie') ||
  text.includes('cinema') ||
  text.includes('film')
) {
  return 'Tamil Cinema';
}

return 'Tamil Cinema';


}

// =========================================================
// LOAD MORE HOME
// =========================================================

loadMoreHomeVideos(): void {


if (
  this.isHomeLoading() ||
  !this.hasMoreHomeVideos()
) {
  return;
}

this.loadHomeVideos(false);


}

// =========================================================
// YOUTUBE SHORTS
// =========================================================

private loadYouTubeShorts(): void {


if (this.isShortsLoading()) {
  return;
}

this.isShortsLoading.set(true);

const params: Record<string, string | number> = {

  part: 'snippet',

  maxResults: 25,

  q: 'Tamil shorts trending',

  type: 'video',

  videoEmbeddable: 'true',

  videoSyndicated: 'true',

  regionCode: 'IN',

  order: 'relevance',

  key: this.YOUTUBE_API_KEY

};

console.log(
  'Vizora Shorts API request'
);

this.http
  .get<any>(
    `${this.YOUTUBE_API_URL}/search`,
    {
      params
    }
  )
  .subscribe({

    next: (response) => {

      const items =
        response?.items || [];

      const videoIds =
        items
          .map(
            (item: any) =>
              item?.id?.videoId
          )
          .filter(
            (id: string | undefined) =>
              !!id
          );

      if (!videoIds.length) {

        this.isShortsLoading.set(false);

        this.useShortsFallback();

        return;
      }

      this.getShortDetails(
        videoIds,
        items
      );
    },

    error: (error) => {

      console.error(
        'Vizora Shorts API error:',
        error
      );

      this.isShortsLoading.set(false);

      this.useShortsFallback();

    }

  });


}

// =========================================================
// SHORT DETAILS
// =========================================================

private getShortDetails(
videoIds: string[],
searchItems: any[]
): void {


const params = {

  part:
    'snippet,statistics,contentDetails',

  id:
    videoIds.join(','),

  key:
    this.YOUTUBE_API_KEY

};

this.http
  .get<any>(
    `${this.YOUTUBE_API_URL}/videos`,
    {
      params
    }
  )
  .subscribe({

    next: (response) => {

      const details =
        response?.items || [];

      const shortVideos: ShortVideo[] =
        details
          .filter(
            (item: any) =>
              this.isShortDuration(
                item?.contentDetails?.duration
              )
          )
          .map(
            (item: any) => {

              const snippet =
                item?.snippet || {};

              const statistics =
                item?.statistics || {};

              const searchItem =
                searchItems.find(
                  (result: any) =>
                    result?.id?.videoId ===
                    item.id
                );

              const title =
                this.decodeHtml(
                  snippet?.title ||
                    'YouTube Short'
                );

              const channelName =
                snippet?.channelTitle ||
                'YouTube Creator';

              const thumbnailUrl =
                snippet?.thumbnails?.maxres?.url ||
                snippet?.thumbnails?.high?.url ||
                snippet?.thumbnails?.medium?.url ||
                snippet?.thumbnails?.default?.url ||
                searchItem?.snippet?.thumbnails?.high?.url ||
                searchItem?.snippet?.thumbnails?.medium?.url ||
                `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

              return {

                id:
                  item.id,

                youtubeId:
                  item.id,

                title,

                thumbnailUrl,

                views:
                  `${this.formatCount(
                    statistics?.viewCount
                  )} views`,

                channelName,

                channelAvatar:
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    channelName
                  )}`,

                likes:
                  this.formatCount(
                    statistics?.likeCount
                  ),

                commentsCount:
                  this.formatCount(
                    statistics?.commentCount
                  )

              };
            }
          );

      const cleanShorts =
        this.removeDuplicateShorts(
          shortVideos
        );

      if (cleanShorts.length > 0) {

        this.shorts.set(
          cleanShorts
        );

        this.secondShorts.set(
          [...cleanShorts].reverse()
        );

        console.log(
          'Vizora Shorts loaded:',
          cleanShorts.length
        );

      } else {

        console.log(
          'Vizora: No short-duration videos found'
        );

        this.useShortsFallback();
      }

      this.isShortsLoading.set(false);

    },

    error: (error) => {

      console.error(
        'Vizora Shorts details error:',
        error
      );

      this.isShortsLoading.set(false);

      this.useShortsFallback();

    }

  });


}

// =========================================================
// SHORT DURATION CHECK
// =========================================================

private isShortDuration(
duration: string
): boolean {


if (!duration) {
  return false;
}

const match =
  duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

if (!match) {
  return false;
}

const hours =
  Number(match[1] || 0);

const minutes =
  Number(match[2] || 0);

const seconds =
  Number(match[3] || 0);

const totalSeconds =
  (hours * 3600) +
  (minutes * 60) +
  seconds;

return totalSeconds > 0 &&
  totalSeconds <= 60;


}

// =========================================================
// SHORT DUPLICATES
// =========================================================

private removeDuplicateShorts(
shorts: ShortVideo[]
): ShortVideo[] {


const seen =
  new Set<string>();

return shorts.filter(
  (short) => {

    if (
      !short?.youtubeId ||
      seen.has(short.youtubeId)
    ) {
      return false;
    }

    seen.add(
      short.youtubeId
    );

    return true;
  }
);


}

// =========================================================
// SHORT FALLBACK
// =========================================================

private useShortsFallback(): void {


this.shorts.set([
  ...this.shortsFeed
]);

this.secondShorts.set([
  ...this.shortsFeed
].reverse());

console.log(
  'Vizora: Using Shorts fallback'
);


}

// =========================================================
// SEARCH
// =========================================================

performSearch(
query: string,
append = false
): void {


const cleanQuery =
  query.trim();

if (!cleanQuery) {

  this.searchQuery.set('');

  this.isSearching.set(false);

  this.searchResults.set([]);

  this.nextPageToken = '';

  this.refreshRecommendationFeed();

  return;
}

this.searchQuery.set(
  cleanQuery
);

this.isSearching.set(true);

this.isLoading.set(true);

if (!append) {

  this.nextPageToken = '';

  this.searchResults.set([]);

}

const params: Record<string, string | number> = {

  part: 'snippet',

  maxResults: 25,

  q: cleanQuery,

  type: 'video',

  videoEmbeddable: 'true',

  videoSyndicated: 'true',

  regionCode: 'IN',

  order: 'relevance',

  key: this.YOUTUBE_API_KEY

};

if (
  append &&
  this.nextPageToken
) {

  params['pageToken'] =
    this.nextPageToken;
}

console.log(
  'Vizora YouTube search:',
  cleanQuery
);

this.http
  .get<any>(
    `${this.YOUTUBE_API_URL}/search`,
    {
      params
    }
  )
  .subscribe({

    next: (response) => {

      const items =
        response?.items || [];

      this.nextPageToken =
        response?.nextPageToken || '';

      console.log(
        'Vizora search results:',
        items.length
      );

      const videoIds =
        items
          .map(
            (item: any) =>
              item?.id?.videoId
          )
          .filter(
            (id: string | undefined) =>
              !!id
          );

      if (!videoIds.length) {

        this.isLoading.set(false);

        return;
      }

      this.getVideoDetails(
        videoIds,
        items,
        append
      );
    },

    error: (error) => {

      console.error(
        'Vizora YouTube search error:',
        error
      );

      this.isLoading.set(false);

    }

  });


}

// =========================================================
// SEARCH VIDEO DETAILS
// =========================================================

private getVideoDetails(
videoIds: string[],
searchItems: any[],
append: boolean
): void {


const params = {

  part:
    'snippet,statistics,contentDetails',

  id:
    videoIds.join(','),

  key:
    this.YOUTUBE_API_KEY

};

this.http
  .get<any>(
    `${this.YOUTUBE_API_URL}/videos`,
    {
      params
    }
  )
  .subscribe({

    next: (response) => {

      const details =
        response?.items || [];

      const videos: Video[] =
        details.map(
          (item: any) => {

            const snippet =
              item?.snippet || {};

            const statistics =
              item?.statistics || {};

            const contentDetails =
              item?.contentDetails || {};

            const searchItem =
              searchItems.find(
                (result: any) =>
                  result?.id?.videoId ===
                  item.id
              );

            const thumbnailUrl =
              snippet?.thumbnails?.maxres?.url ||
              snippet?.thumbnails?.standard?.url ||
              snippet?.thumbnails?.high?.url ||
              snippet?.thumbnails?.medium?.url ||
              snippet?.thumbnails?.default?.url ||
              searchItem?.snippet?.thumbnails?.high?.url ||
              searchItem?.snippet?.thumbnails?.medium?.url ||
              this.createStaticThumbnail(
                snippet?.title ||
                  'Vizora Video',
                'YouTube',
                'VIZORA'
              );

            const title =
              this.decodeHtml(
                snippet?.title ||
                  'Untitled Video'
              );

            const description =
              this.decodeHtml(
                snippet?.description ||
                  ''
              );

            const channelName =
              snippet?.channelTitle ||
              'YouTube Creator';

            return {

              id:
                item.id,

              youtubeId:
                item.id,

              title,

              description,

              thumbnailUrl,

              channelName,

              channelAvatar:
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  channelName
                )}`,

              views:
                this.formatCount(
                  statistics?.viewCount
                ),

              uploadedAt:
                this.formatPublishedDate(
                  snippet?.publishedAt
                ),

              duration:
                this.parseYouTubeDuration(
                  contentDetails?.duration
                ),

              category:
                this.getCategoryFromQuery(
                  this.searchQuery()
                ),

              language: 'Tamil',

              likes:
                this.formatCount(
                  statistics?.likeCount
                )

            };
          }
        );

      const cleanVideos =
        this.removeDuplicateVideos(
          videos
        );

      const mergedVideos =
        append
          ? [
              ...this.searchResults(),
              ...cleanVideos
            ]
          : cleanVideos;

      this.searchResults.set(
        this.removeDuplicateVideos(
          mergedVideos
        )
      );

      this.isLoading.set(false);

      console.log(
        'Vizora videos loaded:',
        cleanVideos.length
      );

    },

    error: (error) => {

      console.error(
        'Vizora video details error:',
        error
      );

      this.isLoading.set(false);

    }

  });


}

// =========================================================
// REMOVE DUPLICATES
// =========================================================

private removeDuplicateVideos(
videos: Video[]
): Video[] {


const seen =
  new Set<string>();

return videos.filter(
  (video) => {

    if (
      !video?.youtubeId ||
      seen.has(video.youtubeId)
    ) {

      return false;
    }

    seen.add(
      video.youtubeId
    );

    return true;
  }
);


}

// =========================================================
// FORMAT COUNT
// =========================================================

private formatCount(
value: string | number | undefined
): string {


if (
  value === undefined ||
  value === null
) {

  return '0';
}

const number =
  Number(value);

if (number >= 1_000_000_000) {

  return `${(
    number / 1_000_000_000
  ).toFixed(1)}B`;
}

if (number >= 1_000_000) {

  return `${(
    number / 1_000_000
  ).toFixed(1)}M`;
}

if (number >= 1_000) {

  return `${(
    number / 1_000
  ).toFixed(1)}K`;
}

return `${number}`;


}

// =========================================================
// PUBLISHED DATE
// =========================================================

private formatPublishedDate(
publishedAt: string
): string {


if (!publishedAt) {
  return 'Recently';
}

const published =
  new Date(publishedAt);

const now =
  new Date();

const difference =
  now.getTime() -
  published.getTime();

const seconds =
  Math.floor(
    difference / 1000
  );

const minutes =
  Math.floor(
    seconds / 60
  );

const hours =
  Math.floor(
    minutes / 60
  );

const days =
  Math.floor(
    hours / 24
  );

if (days < 1) {

  if (hours < 1) {

    if (minutes < 1) {
      return 'just now';
    }

    return `${minutes} min ago`;
  }

  return `${hours} hr ago`;
}

if (days < 7) {
  return `${days} days ago`;
}

if (days < 30) {

  return `${Math.floor(
    days / 7
  )} weeks ago`;
}

if (days < 365) {

  return `${Math.floor(
    days / 30
  )} months ago`;
}

return `${Math.floor(
  days / 365
)} years ago`;


}

// =========================================================
// YOUTUBE DURATION
// =========================================================

private parseYouTubeDuration(
duration: string
): string {


if (!duration) {
  return '0:00';
}

const match =
  duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

if (!match) {
  return '0:00';
}

const hours =
  Number(match[1] || 0);

const minutes =
  Number(match[2] || 0);

const seconds =
  Number(match[3] || 0);

if (hours > 0) {

  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

return `${minutes}:${String(seconds).padStart(2, '0')}`;


}

// =========================================================
// SEARCH CATEGORY
// =========================================================

private getCategoryFromQuery(
query: string
): string {


const text =
  query.toLowerCase();

if (text.includes('trailer')) {
  return 'Trailers';
}

if (text.includes('comedy')) {
  return 'Comedy';
}

if (
  text.includes('gaming') ||
  text.includes('game')
) {
  return 'Gaming';
}

if (text.includes('news')) {
  return 'News';
}

if (text.includes('telugu')) {
  return 'Telugu Cinema';
}

if (
  text.includes('hindi') ||
  text.includes('bollywood')
) {
  return 'Hindi Cinema';
}

if (
  text.includes('melody') ||
  text.includes('melodies')
) {
  return 'Tamil Melodies';
}

if (
  text.includes('music') ||
  text.includes('song') ||
  text.includes('songs')
) {
  return 'Music';
}

if (
  text.includes('movie') ||
  text.includes('cinema')
) {
  return 'Tamil Cinema';
}

return 'Music';


}

// =========================================================
// LOAD MORE SEARCH
// =========================================================

loadMoreSearchResults(): void {


if (
  !this.isLoading() &&
  this.nextPageToken
) {

  this.performSearch(
    this.searchQuery(),
    true
  );
}


}

// =========================================================
// GET VIDEO
// =========================================================

getVideoById(
youtubeId: string
): Video | undefined {


return (
  this.homeVideos().find(
    video =>
      video.youtubeId === youtubeId
  ) ||
  this.searchResults().find(
    video =>
      video.youtubeId === youtubeId
  )
);


}

// =========================================================
// GET SHORT
// =========================================================

getShortById(
id: string
): ShortVideo | undefined {


return (
  this.shorts().find(
    short =>
      short.id === id ||
      short.youtubeId === id
  ) ||
  this.secondShorts().find(
    short =>
      short.id === id ||
      short.youtubeId === id
  )
);


}

}
