import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '@services/auth.service';
import { CommonModule } from "@angular/common";
import { LogoutComponent } from '../logout/logout.component';

@Component({
	selector: "app-home",
	standalone: true,
	imports: [CommonModule, RouterModule, LogoutComponent],
	template: `
		<div class="home-container">
			<div *ngIf="user">
				<p>Inloggad som: {{ user.email }}</p>
				<app-logout></app-logout>
			</div>
		</div>
		<button type="button" *ngIf="!user" (click)="goToLogin()">Logga in</button>
		<h1>Welcome to Emlo docs</h1>
		<div class="container" *ngIf="user">
			<p>Get an overview of your documents</p>
			<a [routerLink]="['/document', 'all']" class="button-link">Show documents</a>
		</div>
	`,

	styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
	user: any;

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadUser();
	}

	private loadUser(): void {	
		if (this.authService.isAuthenticated()) {			
			this.authService.getToken(); // Hämtar token
	
			// Hämta användardetaljer från backend
			this.authService.getUserDetails().subscribe({
				next: (user) => {
					this.user = user;
				},
				error: (error) => {
					console.error("Fel vid hämtning av användardetaljer:", error);
				},
				complete: () => {
					console.log("Förfrågan om användardetaljer är avslutad.");
				}
			});
		} else {
			console.log("Användaren är INTE inloggad.");
		}
	}

	goToLogin() {
		this.router.navigate(['/login']);
	  }
	
}
