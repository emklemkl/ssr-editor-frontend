import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentCreateComponent } from "app/document-create/document-create.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";
@Component({
	selector: "app-navigation",
	standalone: true,
	imports: [RouterModule, DocumentCreateComponent, UserProfileComponent],
	// template: ``,
	templateUrl: "./navigation.component.html",
	styleUrl: "./navigation.component.scss"
})
export class NavigationComponent {}
