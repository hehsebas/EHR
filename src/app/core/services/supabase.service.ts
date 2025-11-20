import { Injectable } from '@angular/core';
import { createSupabaseClient } from '../config/supabase.config';
import type { SupabaseClient } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createSupabaseClient();
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}

