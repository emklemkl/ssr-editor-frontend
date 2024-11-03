import { Routes } from "@angular/router";

import { DocumentComponent } from "./document/document.component";
import { DocumentDetailsComponent } from "./document-details/document-details.component";
import { HomeComponent } from "./home/home.component";
import { DocumentWorkspaceComponent } from "./document-workspace/document-workspace.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
// import { DocumentEditorComponent } from "./document-editor/document-editor.component";


export const routes: Routes = [
	{
		path: "",
		component: HomeComponent,
		title: "Home"
	},
	{
		path: "login",
		component: LoginComponent,
		title: "Login"
	},
	{
		path: "register",
		component: RegisterComponent,
		title: "Register"
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
	},
	// {
	// 	path: 'document/:id/edit',
	// 	component: DocumentEditorComponent,
	// 	title: 'Edit'
	// }
];
