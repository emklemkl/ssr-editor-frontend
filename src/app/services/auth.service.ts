import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Router } from '@angular/router';

@Injectable({
	providedIn: "root"
})
export class AuthService {
	private baseUrl = environment.BASE_URL;
  
	constructor(
		private http: HttpClient,
		private router: Router
	) {}
  
	login(email: string, password: string): Observable<any> {
	  return this.http.post(`${this.baseUrl}/auth/login`, { email, password }, { withCredentials: true });
	}
  
	register(email: string, password: string): Observable<any> {
	  return this.http.post(`${this.baseUrl}/auth/register`, { email, password }, { withCredentials: true });
	}

	getCurrentUser(): Observable<any> {
		return this.http.get(`${this.baseUrl}/auth/me`, { withCredentials: true });
	} 
	
	logout() {
		return this.http.post(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true })
		.subscribe({
			next: () => {
			this.router.navigate(['/login']); // Omdirigera till login-sidan efter utloggning
			},
			error: (err) => {
			console.error('Fel vid utloggning:', err);
			}
		});
	}
	  
  }