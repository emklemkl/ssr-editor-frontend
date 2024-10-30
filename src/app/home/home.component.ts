import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { withHttpTransferCacheOptions } from "@angular/platform-browser";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from '@services/auth.service';

@Component({
	selector: "app-home",
	standalone: true,
	imports: [RouterModule],
	// templateUrl: './home.component.html',
	template: `
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
	error: string = '';
	isLoading = true;

	constructor(
		private authService: AuthService, 
		private http: HttpClient,
		private router: Router
	) {}

	ngOnInit(): void {
		this.http.get('http://localhost:5000/current_user', { withCredentials: true })
		.subscribe({
		  next: (data) => {
			this.user = data;
			this.isLoading = false;
		  },
		  error: (err) => {
			console.error('Error:', err);
			this.error = 'Ingen användare inloggad';
			this.isLoading = false;
			this.router.navigate(['/login'], { queryParams: { redirect: '/' } });
		  }
		});
	}
  }