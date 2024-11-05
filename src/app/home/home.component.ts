import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '@services/auth.service';
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<div class="home-container">
			<div *ngIf="user">
				<p>Inloggad som: {{ user.email }}</p>
			</div>
		</div>

		<h1>Welcome to Emlo docs</h1>
		<p>Get an overview of your documents</p>
		<div class="container">
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
