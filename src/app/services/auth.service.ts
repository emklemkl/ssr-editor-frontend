import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

@Injectable({
	providedIn: "root"
})
export class AuthService {
	// private API_URL = "http://localhost:5000";
	private API_URL = "https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net";
	constructor(
		private http: HttpClient,
		private router: Router
	) {}

	handleGoogleCallback() {
		const redirectUrl = this.router.routerState.snapshot.root.queryParams["redirect"] || "/";
		console.log("!! AuthService Redirecting to:", redirectUrl);
		// this.router.navigate([redirectUrl]);
		this.router.navigateByUrl(redirectUrl);
	}

	isAuthenticated(): Observable<boolean> {
		return this.http.get(`${this.API_URL}/current_user`, { withCredentials: true }).pipe(
			map(() => true),
			catchError(() => of(false))
		);
	}

	getCurrentUser(): Observable<any> {
		return this.http.get(`${this.API_URL}/current_user`, { withCredentials: true });
	}

	logout(): Observable<any> {
		return this.http.get(`${this.API_URL}/logout`, { withCredentials: true });
	}
}
