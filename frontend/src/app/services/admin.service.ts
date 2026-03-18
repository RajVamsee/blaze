import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ManagedUser {
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

  getPendingUsers(): Observable<ManagedUser[]> {
    return this.http.get<ManagedUser[]>(this.API + '/pending-users');
  }

  getAllUsers(): Observable<ManagedUser[]> {
    return this.http.get<ManagedUser[]>(this.API + '/all-users');
  }

  approveUser(userId: number): Observable<string> {
    return this.http.post(this.API + '/approve/' + userId, {}, { responseType: 'text' });
  }

  rejectUser(userId: number): Observable<string> {
    return this.http.post(this.API + '/reject/' + userId, {}, { responseType: 'text' });
  }
}
