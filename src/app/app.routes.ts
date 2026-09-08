import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent)
  },
  {
    path: 'watch/:id',
    loadComponent: () => import('./features/watch/watch').then((m) => m.WatchComponent)
  },
  {
    path: 'shorts',
    loadComponent: () => import('./features/shorts/shorts').then((m) => m.ShortsComponent)
  },
  {
    path: 'shorts/:id',
    loadComponent: () => import('./features/shorts/shorts').then((m) => m.ShortsComponent)
  },
  {
    path: 'feed/history',
    loadComponent: () => import('./features/library/history.component').then((m) => m.HistoryComponent)
  },
  {
    path: 'channel/:handle',
    loadComponent: () => import('./features/channel/channel').then((m) => m.ChannelComponent)
  },
  {
    path: 'playlist',
    loadComponent: () => import('./features/playlist/playlist').then((m) => m.PlaylistComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];