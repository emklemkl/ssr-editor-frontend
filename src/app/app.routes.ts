import { Routes } from '@angular/router';
import { DocumentComponent } from './document/document.component';

export const routes: Routes = [
  {
    path: "document/all",
    component: DocumentComponent,
    title: "All documents"
  }
];
