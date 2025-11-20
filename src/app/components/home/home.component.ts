import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="min-h-screen">
      <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-20 px-5 text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-6xl font-bold mb-4">{{ 'home.title' | translate }}</h1>
          <p class="text-2xl md:text-3xl mb-6 opacity-95">{{ 'home.subtitle' | translate }}</p>
          <p class="text-lg md:text-xl leading-relaxed mb-8 opacity-90 max-w-3xl mx-auto">
            {{ 'home.description' | translate }}
          </p>
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <a routerLink="/login" class="px-8 py-3.5 bg-white text-indigo-600 rounded-lg font-medium no-underline transition-all hover:-translate-y-0.5 hover:opacity-90">
              {{ 'home.login' | translate }}
            </a>
            <a href="#features" class="px-8 py-3.5 bg-transparent text-white border-2 border-white rounded-lg font-medium no-underline transition-all hover:-translate-y-0.5 hover:opacity-90">
              {{ 'home.learnMore' | translate }}
            </a>
          </div>
        </div>
      </div>
      <div class="py-20 px-5 bg-gray-50 dark:bg-gray-900" id="features">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-4xl font-semibold text-center mb-12 text-gray-900 dark:text-gray-100">{{ 'home.features' | translate }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <span class="material-icons text-6xl text-primary dark:text-primary-light mb-4">history</span>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{{ 'home.feature1.title' | translate }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ 'home.feature1.desc' | translate }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <span class="material-icons text-6xl text-primary dark:text-primary-light mb-4">analytics</span>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{{ 'home.feature2.title' | translate }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ 'home.feature2.desc' | translate }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <span class="material-icons text-6xl text-primary dark:text-primary-light mb-4">security</span>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{{ 'home.feature3.title' | translate }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ 'home.feature3.desc' | translate }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <span class="material-icons text-6xl text-primary dark:text-primary-light mb-4">schedule</span>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{{ 'home.feature4.title' | translate }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ 'home.feature4.desc' | translate }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <span class="material-icons text-6xl text-primary dark:text-primary-light mb-4">medication</span>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{{ 'home.feature5.title' | translate }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ 'home.feature5.desc' | translate }}</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <span class="material-icons text-6xl text-primary dark:text-primary-light mb-4">devices</span>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{{ 'home.feature6.title' | translate }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ 'home.feature6.desc' | translate }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-20 px-5 text-center">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">{{ 'home.cta.title' | translate }}</h2>
          <p class="text-lg md:text-xl mb-8 opacity-90">{{ 'home.cta.description' | translate }}</p>
          <a routerLink="/login" class="inline-block px-8 py-3.5 bg-white text-indigo-600 rounded-lg font-medium no-underline transition-all hover:-translate-y-0.5 hover:opacity-90">
            {{ 'home.login' | translate }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent { }
