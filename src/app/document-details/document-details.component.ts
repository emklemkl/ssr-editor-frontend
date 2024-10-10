import { CommonModule, NgIf } from "@angular/common";
import { Component, input, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Document } from "@interfaces/document";
import { DocumentService } from "@services/document.service";
import { SocketDocumentService } from "@services/socket-document.service";
import { Observable } from "rxjs";
// import { CommonModule } from "@angular/common";

@Component({
	selector: "app-document-details",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, NgIf, FormsModule],
	// templateUrl: "./document-details.component.html",
	template: `
		<section class="" *ngIf="document$ | async as document">
			<input type="text" [(ngModel)]="currentDocument.title" placeholder="Title" />
			<textarea type="text" [(ngModel)]="currentDocument.content" name="text-content"></textarea>
			<button (click)="submitUpdateDoc()" class="submit-button">Update</button>
		</section>
	`,
	styleUrl: "./document-details.component.scss"
})

export class DocumentDetailsComponent implements OnInit, OnChanges {
	@Input() id = "";
	document$!: Observable<Document>;
	changeCount: number = 0;
	updateDocForm = new FormGroup({
		title: new FormControl<string>(""),
		content: new FormControl<string>("")
	});
	content: string = "";
	currentDocument: Document = { _id: this.id, title: "", content: "" };
	constructor(
		private documentService: DocumentService,
		private socketDocumentService: SocketDocumentService
	) {}
	changeSaver(event: any) {
		console.log(this.content);
		console.log(event.target.value);
		const updatedContent = (event.target as HTMLTextAreaElement).value;

		// console.log("Content changed:", updatedContent);
		// console.log(this.changeCount);
	}
	ngOnChanges(changes: SimpleChanges) {
		this.document$ = this.documentService.getDocument(this.id);

		this.document$.subscribe((document) => {
			this.updateDocForm.patchValue({
				title: document.title,
				content: document.content
			});
		});
	}
	// ngOnChanges(changes: SimpleChanges) {
	// 	console.log(changes);
	// 	if (changes["user"]) {
	// 		const currentValue = changes["user"].currentValue;
	// 		const previousValue = changes["user"].previousValue;
	// 		console.log("User changed from", previousValue, "to", currentValue);
	// 	}
	// }

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
		console.log("Title", this.currentDocument.title);
		console.log("Content", this.currentDocument.content);
		const data: Document = {
			_id: this.id,
			title: this.updateDocForm.value.title ?? "",
			content: this.updateDocForm.value.content ?? ""
		};
		this.socketDocumentService.sendMessage(JSON.stringify(data));
		// .submitUpdateDoc(this.id, this.updateDocForm.value.title ?? "", this.updateDocForm.value.content ?? "")
		// 	.subscribe({
		// 		error: (error) => {
		// 			console.error("Something went wrong:", error);
		// 		}
		// 	});
	}
}
