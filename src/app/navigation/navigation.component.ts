import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentCreateComponent } from "app/document-create/document-create.component";
import { LogoutComponent } from '../logout/logout.component';
import { LoginComponent } from '../login/login.component';

@Component({
	selector: "app-navigation",
	standalone: true,
	imports: [RouterModule, DocumentCreateComponent, LogoutComponent, LoginComponent],
	// template: ``,
	templateUrl: "./navigation.component.html",
	styleUrl: "./navigation.component.scss"
})
export class NavigationComponent {}
