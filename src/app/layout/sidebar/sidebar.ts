import { Component, inject } from '@angular/core';
import { UiService } from '../../core/services/ui';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  uiService = inject(UiService);
}