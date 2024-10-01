import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: "app-home",
	standalone: true,
	imports: [RouterModule],
	// templateUrl: './home.component.html',
	template: `<a [routerLink]="['/document/', 'all']">To All</a>`,
	styleUrl: "./home.component.scss",
})
export class HomeComponent {}
