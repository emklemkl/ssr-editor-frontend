import { Component, Input, OnInit } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { Document } from "@interfaces/document";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
// import { CommonModule } from "@angular/common";

@Component({
	selector: "app-document-details",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	// templateUrl: "./document-details.component.html",
	template: `
		<form [formGroup]="updateDocForm" (submit)="submitUpdateDoc()">
			<section class="" *ngIf="document$ | async as document">
				<input type="text" formControlName="title" />
				<input type="text" formControlName="content" />
				<button type="submit" class="submit-button">Update</button>
			</section>
		</form>
	`,
	styleUrl: "./document-details.component.scss",
})
export class DocumentDetailsComponent implements OnInit {
	@Input("id") documentId: string = "";
	document$!: Observable<Document>;

	updateDocForm = new FormGroup({
		title: new FormControl<string>(""),
		content: new FormControl<string>(""),
	});
	constructor(private documentService: DocumentService) {}

	ngOnInit(): void {
		this.document$ = this.documentService.getDocument(this.documentId);

		this.document$.subscribe((document) => {
			this.updateDocForm.patchValue({
				title: document.title,
				content: document.content,
			});
		});
	}

	submitUpdateDoc() {
		this.documentService.submitUpdateDoc(
			this.documentId,
			this.updateDocForm.value.title ?? "",
			this.updateDocForm.value.content ?? ""
		).subscribe({
			error: (error) => {
				console.error("Something went wrong:", error);
			},
		});
	}
}
