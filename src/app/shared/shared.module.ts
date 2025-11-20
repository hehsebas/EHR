import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CardComponent } from './components/card/card.component';
import { PowerBiEmbedComponent } from './components/power-bi-embed/power-bi-embed.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    CardComponent,
    PowerBiEmbedComponent
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    CardComponent,
    PowerBiEmbedComponent
  ]
})
export class SharedModule { }

