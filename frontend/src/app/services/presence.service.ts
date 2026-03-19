import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserPresence {
  id: number;
  username: string;
  presenceStatus: 'ONLINE' | 'IDLE' | 'OFFLINE';
}

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private base = `${environment.apiUrl}/presence`;

  constructor(private http: HttpClient) {}

  heartbeat(): Observable<void> {
    return this.http.post<void>(`${this.base}/heartbeat`, {});
  }

  getTeam(): Observable<UserPresence[]> {
    return this.http.get<UserPresence[]>(`${this.base}/team`);
  }
}
