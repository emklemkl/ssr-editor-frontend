import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '@services/auth.service';
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [CommonModule, RouterModule],
	// templateUrl: './home.component.html',
	template: `
		<div class="home-container">
			<div *ngIf="user">
				<p>Inloggad som: {{ user.email }}</p>
				<button (click)="logout()">Logga ut</button>
			</div>
			</div>

		<h1>Welcome to Emlo docs</h1>
		<p>Get an overview of your documents</p>
		<div class="container">
			<a [routerLink]="['/document', 'all']" class="button-link">Show documents</a>
		</div>
	`,

	styleUrl: "./home.component.scss"
})
export class HomeComponent implements OnInit {
	user: any;

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.authService.getCurrentUser().subscribe({
			next: (user) => {
			  this.user = user;
			},
			error: () => {
			  console.error("Användaren är inte inloggad");
			}
		  });
		}
	
	// Logga ut användaren och navigera tillbaka till login-sidan
	logout(): void {
		this.authService.logout();
	}
}
