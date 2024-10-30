import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { NavigationComponent } from "./navigation/navigation.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, NavigationComponent, UserProfileComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent {
	title = "ssr-editor-frontend";
}
