import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentCreateComponent } from "app/document-create/document-create.component";
import { LogoutComponent } from '../logout/logout.component';
import { LoginComponent } from '../login/login.component';
import { AuthService } from "@services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-navigation",
	standalone: true,
	imports: [CommonModule, RouterModule, DocumentCreateComponent, LogoutComponent, LoginComponent],
	// template: ``,
	templateUrl: "./navigation.component.html",
	styleUrl: "./navigation.component.scss"
})
export class NavigationComponent {
	user: any;
	constructor(
		private authService: AuthService,
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
}
