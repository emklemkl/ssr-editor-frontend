import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentCreateComponent } from "app/document-create/document-create.component";
@Component({
	selector: "app-navigation",
	standalone: true,
	imports: [RouterModule, DocumentCreateComponent],
	// template: ``,
	templateUrl: "./navigation.component.html",
	styleUrl: "./navigation.component.scss"
})
export class NavigationComponent {}
