import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DocumentRequest {
  title: string;
  content: string;
}

export interface DocumentResponse {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly API = environment.apiUrl + '/documents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(this.API);
  }

  getById(id: number): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.API}/${id}`);
  }

  create(req: DocumentRequest): Observable<DocumentResponse> {
    return this.http.post<DocumentResponse>(this.API, req);
  }

  update(id: number, req: DocumentRequest): Observable<DocumentResponse> {
    return this.http.put<DocumentResponse>(`${this.API}/${id}`, req);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(this.API + '/' + id, { responseType: 'text' });
  }
}
