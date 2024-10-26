import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:5000/current_user', { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.get('http://localhost:5000/logout', { withCredentials: true });
  }
}
