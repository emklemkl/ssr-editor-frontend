import { Component, OnInit } from "@angular/core";
import { DocumentService } from "../document.service";
import { Document } from "../document.service";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-document",
	standalone: true,
	imports: [CommonModule],
	template: `<div *ngFor="let document of documents">
		{{ document.name }}
	</div>`,
	// templateUrl: './document.component.html',
	styles: ``,
})
export class DocumentComponent {
	documents: Document[] = [];
	constructor(private documentService: DocumentService) {

	}
	ngOnInit(): void {
		this.getAllDocuments();
	}
	getAllDocuments() {
		this.documentService.getAllDocuments().subscribe(doc => {
			console.log(doc);
			this.documents = doc;
		});
	}
}
