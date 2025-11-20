import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-60"
      [ngClass]="{
        'cursor-pointer hover:shadow-lg hover:border-primary hover:border-2': clickable
      }">
      
      <div class="text-gray-600 dark:text-gray-400">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CardComponent {
  @Input() clickable = false;
}
