import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isSidebarOpen = signal<boolean>(true);

  toggleSidebar(): void {
    this.isSidebarOpen.update((open) => !open);
  }
}