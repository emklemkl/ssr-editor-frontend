import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: "app-home",
	standalone: true,
	imports: [RouterModule],
	// templateUrl: './home.component.html',
	template: `<a [routerLink]="['/document', 'all']">Show documents</a>`,
	styleUrl: "./home.component.scss",
})
export class HomeComponent {}
