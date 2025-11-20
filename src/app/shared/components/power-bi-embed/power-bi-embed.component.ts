import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-power-bi-embed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full min-h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-10 text-center text-gray-600 dark:text-gray-400" *ngIf="!isEmbedded">
        <div class="max-w-2xl mx-auto">
          <span class="material-icons text-6xl text-primary dark:text-primary-light mb-4 block">bar_chart</span>
          <h3 class="text-2xl text-gray-900 dark:text-gray-100 mb-2">Visualización Power BI</h3>
          <p class="mb-4">Reporte ID: {{ reportId || 'No especificado' }}</p>
          <div *ngIf="filters && filters.length > 0" class="text-left bg-white dark:bg-gray-700 p-4 rounded-lg mb-4">
            <strong class="text-gray-900 dark:text-gray-100">Filtros aplicados:</strong>
            <ul class="mt-2 ml-5 list-disc">
              <li *ngFor="let filter of filters" class="text-gray-600 dark:text-gray-400">{{ filter }}</li>
            </ul>
          </div>
          <div class="text-left bg-white dark:bg-gray-700 p-5 rounded-lg text-xs">
            <p class="mb-2"><strong class="text-gray-900 dark:text-gray-100">Nota:</strong> Este es un componente simulado para integración con Power BI.</p>
            <p class="mb-2 text-gray-600 dark:text-gray-400">Para implementar la integración real, necesitarás:</p>
            <ul class="mb-2 ml-5 list-disc text-gray-600 dark:text-gray-400">
              <li>Token de acceso de Power BI</li>
              <li>URL del workspace y reporte</li>
              <li>SDK de Power BI JavaScript</li>
            </ul>
            <p class="mb-2 text-gray-600 dark:text-gray-400">Ejemplo de código:</p>
            <pre class="bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto mt-3 text-[11px] text-gray-700 dark:text-gray-300"><code>import * as pbi from 'powerbi-client';
const embedConfig = {{ '{' }}
  type: 'report',
  id: '{{ reportId }}',
  embedUrl: 'https://app.powerbi.com/...',
  accessToken: 'YOUR_TOKEN',
  tokenType: pbi.models.TokenType.Embed
{{ '}' }};
const report = powerbi.embed(container, embedConfig);</code></pre>
          </div>
        </div>
      </div>
      <div class="w-full h-[600px]" *ngIf="isEmbedded">
        <iframe
          [src]="embedUrl"
          frameborder="0"
          allowFullScreen="true"
          class="w-full h-full border-none">
        </iframe>
      </div>
    </div>
  `,
  styles: []
})
export class PowerBiEmbedComponent implements OnInit, OnChanges {
  @Input() reportId?: string;
  @Input() filters?: string[];
  @Input() embedUrl?: string;
  @Input() isEmbedded = false;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
