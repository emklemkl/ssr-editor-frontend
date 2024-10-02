import { Component, inject, OnInit } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { Document } from "@interfaces/document";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
	selector: "app-document",
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<section class="document-listing">
			<div *ngFor="let document of documents">
				<a [routerLink]="['/document/view/', document._id]">
					<div class="document-listing-details ">
						<h1>{{ document.title }}</h1>
						<p>{{ document.content }}</p>
					</div>
				</a>
			</div>
		</section>
	`,
	// templateUrl: "./document.component.html",
	styleUrl: "./document.component.scss",
})
export class DocumentComponent implements OnInit {
	newDoc?: Observable<Document>;
	documents: Document[] = [];

	constructor(private documentService: DocumentService) {}

	ngOnInit(): void {
		this.getAllDocuments();
	}
	getAllDocuments() {
		this.documentService.getAllDocuments().subscribe((doc) => {
			this.documents = doc;
		});
	}
}
