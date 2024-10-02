import { Component, inject, OnInit } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { Document } from "@interfaces/document";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
	selector: "app-document",
	standalone: true,
	imports: [CommonModule, RouterModule, ReactiveFormsModule],
	template: `
		<section>
			<form [formGroup]="createNewDocForm" (submit)="submitCreateNewDoc()">
				<label for="new-doc-title">New document</label>
				<input type="text" id="new-doc-title" formControlName="title" placeholder="Title"/>
				<button type="submit" class="submit-button">Create</button>
			</form>
		</section>
		<section>
			<ul>
				<li *ngFor="let document of documents">
					<a [routerLink]="['/document/view/', document._id]">
						Id: {{ document._id }} Title: {{ document.title }}</a
					>
				</li>
			</ul>
		</section>
	`,
	// templateUrl: "./document.component.html",
	styles: ``,
})
export class DocumentComponent implements OnInit {
	newDoc?: Observable<Document>;
	documents: Document[] = [];
	createNewDocForm = new FormGroup({
		title: new FormControl<string>(""),
		content: new FormControl<string>(""),
	});

	constructor(private documentService: DocumentService) { }
	private router = inject(Router)

	ngOnInit(): void {
		this.getAllDocuments();
	}
	getAllDocuments() {
		this.documentService.getAllDocuments().subscribe((doc) => {
			this.documents = doc;
		});
	}

	submitCreateNewDoc() {
		let _id: string;
		this.newDoc = this.documentService.submitCreateNewDoc(
			this.createNewDocForm.value.title ?? "",
			this.createNewDocForm.value.content ?? ""
		)
		this.newDoc.subscribe({
			next: (response) => {
				if (response._id) {
					_id = response._id;
				}
					this.router.navigate([`document/view/${_id}`]);

			},
			error: (error) => {
				console.error("Something went wrong:", error);
				this.router.navigate([""])
			}
		})

	}
}
