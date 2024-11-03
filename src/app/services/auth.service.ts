import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
	providedIn: "root"
})
export class AuthService {
  private baseUrl = environment.BASE_URL;
  private tokenKey = 'authToken';

  constructor(
	private http: HttpClient,
	private router: Router
  ) {}

  register(email: string, password: string): Observable<any> {
		return this.http.post(`${this.baseUrl}/auth/register`, { email, password });
  }

  login(email: string, password: string): Observable<any> {
		return this.http.post<any>(`${this.baseUrl}/auth/login`, { email, password });
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  sendInvitation(documentId: string, email: string): Observable<any> {
	const apiUrl = `${this.baseUrl}/document/${documentId}/invite`; // Byt ut URL:n till `this.URL` om det är bas-URL:en du använder
	const token = localStorage.getItem('jwtToken'); // Hämta token från localStorage

	if (!token) {
		console.error('Ingen JWT-token hittades i localStorage');
		return throwError(() => new Error('Ingen token tillgänglig'));
	  }
  
	const headers = new HttpHeaders({
	  'Authorization': `Bearer ${token}` // Skicka med JWT-token
	});
  
	return this.http.post(apiUrl, { email }, { headers, withCredentials: true });
  }
  

  getUserDetails(): Observable<any> {
    const token = this.getToken();
    return this.http.get(`${this.baseUrl}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
  }

  logout() {
    // Ta bort JWT-token från localStorage eller sessionStorage
    localStorage.removeItem('jwtToken');
    // Navigera till login-sidan eller annan sida efter utloggning
    this.router.navigate(['/login']);
  }
}