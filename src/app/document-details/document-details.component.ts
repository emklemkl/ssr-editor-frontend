import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Document } from "@interfaces/document";
import { DocumentService } from "@services/document.service";
import { Observable } from "rxjs";
// import { CommonModule } from "@angular/common";

@Component({
	selector: "app-document-details",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	// templateUrl: "./document-details.component.html",
	template: `
		<form [formGroup]="updateDocForm" (submit)="submitUpdateDoc()">
			<section class="" *ngIf="document$ | async as document">
				<input type="text" formControlName="title" placeholder="Titel" />
				<textarea type="text" formControlName="content"></textarea>
				<button type="submit" class="submit-button">Update</button>
			</section>
		</form>
	`,
	styleUrl: "./document-details.component.scss"
})
export class DocumentDetailsComponent implements OnInit {
	@Input() id = "";
	document$!: Observable<Document>;

	updateDocForm = new FormGroup({
		title: new FormControl<string>(""),
		content: new FormControl<string>("")
	});
	constructor(private documentService: DocumentService) {}

	ngOnInit(): void {
		this.document$ = this.documentService.getDocument(this.id);

		this.document$.subscribe((document) => {
			this.updateDocForm.patchValue({
				title: document.title,
				content: document.content
			});
		});
	}

	submitUpdateDoc() {
		this.documentService
			.submitUpdateDoc(this.id, this.updateDocForm.value.title ?? "", this.updateDocForm.value.content ?? "")
			.subscribe({
				error: (error) => {
					console.error("Something went wrong:", error);
				}
			});
	}
}
