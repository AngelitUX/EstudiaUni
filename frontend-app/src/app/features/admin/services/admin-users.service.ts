import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AdminUserSummary {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: 'free' | 'premium';
  subscriptionStatus: string | null;
  subscriptionEndDate: string | null;
  premiumDaysLeft: number | null;
  isAdmin: boolean;
  emailVerified: boolean | null;
  createdAt: string | null;
}

export interface ListUsersResponse {
  users: AdminUserSummary[];
  nextCursor: string | null;
}

export type PlanFilter = 'all' | 'free' | 'premium';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);

  listUsers(opts: { plan?: PlanFilter; search?: string; cursor?: string; limit?: number }): Observable<ListUsersResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const params: Record<string, string> = {};
    if (opts.plan && opts.plan !== 'all') params['plan'] = opts.plan;
    if (opts.search) params['search'] = opts.search;
    if (opts.cursor) params['cursor'] = opts.cursor;
    if (opts.limit) params['limit'] = String(opts.limit);

    const query = new URLSearchParams(params).toString();
    const url = `${baseUrl}/api/admin/users${query ? '?' + query : ''}`;
    return this.http.get<ListUsersResponse>(url);
  }
}
