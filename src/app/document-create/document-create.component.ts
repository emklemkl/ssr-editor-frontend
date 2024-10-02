import { Component, inject, OnInit } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { Document } from "@interfaces/document";
import { RouterModule, Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
	selector: "app-document-create",
	standalone: true,
	imports: [RouterModule, ReactiveFormsModule],
	template: `
		<form class="inline-form" [formGroup]="createNewDocForm" (submit)="submitCreateNewDoc()">
			<input type="text" id="new-doc-title" formControlName="title" placeholder="Title" />
			<button type="submit" class="submit-button">Create</button>
		</form>
	`,
	//   templateUrl: './document-create.component.html',
	styleUrl: "./document-create.component.scss",
})
export class DocumentCreateComponent {
	newDoc?: Observable<Document>;
	createNewDocForm = new FormGroup({
		title: new FormControl<string>(""),
		content: new FormControl<string>(""),
	});

	constructor(private documentService: DocumentService) {}
	private router = inject(Router);

	submitCreateNewDoc() {
		let _id: string;
		this.newDoc = this.documentService.submitCreateNewDoc(
			this.createNewDocForm.value.title ?? "",
			this.createNewDocForm.value.content ?? ""
		);
		this.newDoc.subscribe({
			next: (response) => {
				if (response._id) {
					_id = response._id;
				}
				this.router.navigate([`document/view/${_id}`]);
			},
			error: (error) => {
				console.error("Something went wrong:", error);
				this.router.navigate([""]);
			},
		});
	}
}
