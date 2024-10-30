import { Routes } from "@angular/router";

import { DocumentComponent } from "./document/document.component";
import { DocumentDetailsComponent } from "./document-details/document-details.component";
import { HomeComponent } from "./home/home.component";
import { DocumentWorkspaceComponent } from "./document-workspace/document-workspace.component";

export const routes: Routes = [
	{
		path: "",
		component: HomeComponent,
		title: "Home"
	},
	{
		path: "document/view/:id",
		component: DocumentWorkspaceComponent,
		title: "Document Workspace"
	},
	{
		path: "document/all",
		component: DocumentComponent,
		title: "All documents"
	}
];
