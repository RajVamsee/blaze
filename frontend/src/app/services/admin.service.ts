import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PendingUser {
  id: number;
  username: string;
  email: string;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(this.API + '/pending-users');
  }

  approveUser(userId: number): Observable<string> {
    return this.http.post(this.API + '/approve/' + userId, {}, { responseType: 'text' });
  }
}
