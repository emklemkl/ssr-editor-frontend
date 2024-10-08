import { Routes } from "@angular/router";

import { DocumentComponent } from "./document/document.component";
import { DocumentDetailsComponent } from "./document-details/document-details.component";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
	{
		path: "",
		component: HomeComponent,
		title: "Home"
	},
	{
		path: "document/view/:id",
		component: DocumentDetailsComponent,
		title: "Document"
	},
	{
		path: "document/all",
		component: DocumentComponent,
		title: "All documents"
	}
];
