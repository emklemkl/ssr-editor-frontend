import { CommonModule, NgIf } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Document } from "@interfaces/document";
import { DocumentService } from "@services/document.service";
import { SocketDocumentService } from "@services/socket-document.service";
import { Observable } from "rxjs";

@Component({
	selector: "app-document-details",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, NgIf, FormsModule],
	// templateUrl: "./document-details.component.html",
	template: `
		<section class="" *ngIf="document$ | async as document">
			<input type="text" (input)="submitUpdateDoc()" [(ngModel)]="currentDocument.title" placeholder="Title" />
			<textarea
				type="text"
				(input)="submitUpdateDoc()"
				[(ngModel)]="currentDocument.content"
				name="text-content"
			></textarea>
			<button (click)="submitUpdateDoc()" class="submit-button">Update</button>
		</section>
	`,
	styleUrl: "./document-details.component.scss"
})

export class DocumentDetailsComponent implements OnInit, OnChanges {
	@Input() id = "";
	document$!: Observable<Document>;
	currentDocument: Document = { _id: this.id, title: "", content: "" };
	typingTimer!: ReturnType<typeof setTimeout>;
	TIMEOUT_DELAY = 500;
	constructor(
		private documentService: DocumentService,
		private socketDocumentService: SocketDocumentService
	) {}

	ngOnInit(): void {
		this.document$ = this.documentService.getDocument(this.id);

		this.document$.subscribe((document) => {
			this.currentDocument._id = this.id;
			this.currentDocument.title = document.title;
			this.currentDocument.content = document.content;
		});

		this.socketDocumentService.createRoom(this.id);

		// Subscribes to textarea and input and reacts to changes.
		this.socketDocumentService.getChanges().subscribe((msg: any) => {
			this.currentDocument.title = msg.title;
			this.currentDocument.content = msg.content;
		});
	}

	ngOnChanges(simpleChanges: SimpleChanges): void {
		for (const change in simpleChanges) {
			if (change === "id") {
				this.document$ = this.documentService.getDocument(this.id);
				this.document$.subscribe((document) => {
					this.currentDocument._id = this.id;
					this.currentDocument.title = document.title;
					this.currentDocument.content = document.content;
				});
				this.socketDocumentService.createRoom(this.id);
			}
		}
	}

	submitUpdateDoc() {
		clearTimeout(this.typingTimer);
		this.typingTimer = setTimeout(() => {
			this.socketDocumentService.sendChanges(JSON.stringify(this.currentDocument));
		}, this.TIMEOUT_DELAY);
	}
}
