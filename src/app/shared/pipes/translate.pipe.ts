import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private cache: Map<string, string> = new Map();
  private subscription: Subscription | null = null;
  private currentLanguage: string = '';

  constructor(
    private translationService: TranslationService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.subscription = this.translationService.getCurrentLanguage$().subscribe(lang => {
      if (this.currentLanguage !== lang) {
        this.currentLanguage = lang;
        this.cache.clear();
        this.changeDetector.markForCheck();
      }
    });
  }

  transform(key: string, params?: { [key: string]: string | number }): string {
    if (!key) {
      return '';
    }

    const cacheKey = `${this.currentLanguage}:${key}:${params ? JSON.stringify(params) : ''}`;
    
    if (!this.cache.has(cacheKey)) {
      const translation = this.translationService.translate(key, params);
      this.cache.set(cacheKey, translation);
      return translation;
    }

    return this.cache.get(cacheKey) || key;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.cache.clear();
  }
}
