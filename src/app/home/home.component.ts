import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: "app-home",
	standalone: true,
	imports: [RouterModule],
	// templateUrl: './home.component.html',
	template: `
	<h1>Welcome to Emlo docs</h1>
	<p> Get an overview of your documents</p>
	<div class="container">
		<a [routerLink]="['/document', 'all']" class="button-link">Show documents</a>
	</div>
		`,

	styleUrl: "./home.component.scss",
})
export class HomeComponent {}
