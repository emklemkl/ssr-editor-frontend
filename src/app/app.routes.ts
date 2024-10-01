import { Routes } from '@angular/router';
import { DocumentComponent } from './document/document.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
	{
		path: "",
		component: HomeComponent,
		title: "Home"
	},
	{
		path: "document/view/:id",
		component: DocumentComponent,
		title: "Document"
	},
	{
		path: "document/all",
		component: DocumentComponent,
		title: "All documents"
	},
];
