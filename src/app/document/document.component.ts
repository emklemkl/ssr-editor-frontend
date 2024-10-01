import { Component, OnInit } from "@angular/core";
import { DocumentService } from "../document.service";
import { Document } from "@interfaces/document";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
@Component({
	selector: "app-document",
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<ul>
			<li *ngFor="let document of documents">
				<a [routerLink]="['/document/view/', document._id]"> Id: {{ document._id }} Name: {{ document.name }} Lives:
				{{ document.bor }}</a>
			</li>
		</ul>
	`,
	// templateUrl: "./document.component.html",
	styles: ``,
})
export class DocumentComponent {
	documents: Document[] = [];
	constructor(private documentService: DocumentService) {}
	ngOnInit(): void {
		this.getAllDocuments();
	}
	getAllDocuments() {
		this.documentService.getAllDocuments().subscribe((doc) => {
			this.documents = doc;
			console.log(this.documents);
			for (let docu of this.documents) {
				console.log(docu);
			}
		});
	}
	// getDocument() {
	// 	this.documentService.getDocument(1).subscribe((doc) => {
	// 		console.log(doc);
	// 		this.documents = doc;
	// 	});
	// }
}
