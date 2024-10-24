import { CommonModule, NgIf } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Document } from "@interfaces/document";
import { DocumentService } from "@services/document.service";
import { SocketDocumentService } from "@services/socket-document.service";
import { ContentModifierComponent } from "app/content-modifier/content-modifier.component";
import { Observable } from "rxjs";


@Component({
	selector: "app-document-details",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, NgIf, FormsModule, ContentModifierComponent],
	template: `
		@if (richTextAllowed) {
			<section class="text-fields" *ngIf="document$ | async as document">
				<input
					type="text"
					(input)="submitUpdateDoc()"
					[(ngModel)]="currentDocument.title"
					placeholder="Title"
				/>
				<div
					contenteditable="true"
					type="text"
					(input)="onContentChange(editableDiv)"
					[innerHTML]="newestContent"
					name="text-content"
					#editableDiv
					class="editable-content"
				>
					{{ newestContent }}
				</div>
			</section>
		} @else {
			<section class="text-fields" *ngIf="document$ | async as document">
				<textarea (input)="submitUpdateDocComment()">Add your comment here</textarea>
			</section>
		}
	`,
	styleUrl: "./document-details.component.scss"
})
export class DocumentDetailsComponent implements OnInit, OnChanges {
	@Input() id = "";
	@Input() document$!: Observable<Document>;
	@Input() richTextAllowed: boolean = true;
	@Input() commentAdded?: number;
	newestContent: any;
	currentDocument: Document = { _id: this.id, title: "", content: "", comments: {} };
	typingTimer!: ReturnType<typeof setTimeout>;
	typingTimerComment!: ReturnType<typeof setTimeout>;
	TIMEOUT_DELAY = 500;
	constructor(
		private documentService: DocumentService,
		private socketDocumentService: SocketDocumentService
	) {}

	ngOnInit(): void {
		this.document$.subscribe((document) => {
			this.currentDocument._id = this.id;
			this.currentDocument.title = document.title;
			this.currentDocument.content = document.content;
		});
		this.newestContent = this.currentDocument.content;
		this.socketDocumentService.createRoom(this.id);

		// Subscribes to textarea and input and reacts to changes.
		this.socketDocumentService.getChanges().subscribe((msg: any) => {
			this.currentDocument.title = msg.title;
			this.currentDocument.content = msg.content;
			this.newestContent = this.currentDocument.content;
			this.updateEditableDivContent();
		});
	}
	updateEditableDivContent() {
		const editableDiv = document.querySelector(".editable-content") as HTMLElement;
		this.newestContent = this.newestContent.replace(/&nbsp;+/g, " ").trim();
		if (editableDiv && editableDiv.innerHTML !== this.newestContent) {
			editableDiv.innerHTML = this.newestContent;
		}
	}
	ngOnChanges(simpleChanges: SimpleChanges): void {
		for (const change in simpleChanges) {
			if (change === "id") {
				console.log("change", change);
				this.document$ = this.documentService.getDocument(this.id);
				this.document$.subscribe((document) => {
					this.currentDocument._id = this.id;
					this.currentDocument.title = document.title;
					this.currentDocument.content = document.content;
					this.updateEditableDivContent();
				});
				this.socketDocumentService.createRoom(this.id);
			}
			else if (change === "commentAdded") {
				console.log("change", change);
				this.currentDocument.comments = {[String(this.commentAdded)]: "Placeholder comment!"}
				console.log("Comment_Added ngOneChanges", this.commentAdded);
				this.submitUpdateDocComment();
			}
		}
	}

	submitUpdateDoc() {
		clearTimeout(this.typingTimer);
		console.log("SubmitUpdateDoc!");
		this.typingTimer = setTimeout(() => {
			this.socketDocumentService.sendChanges(JSON.stringify(this.currentDocument));
		}, this.TIMEOUT_DELAY);
	}

	submitUpdateDocComment() {
		clearTimeout(this.typingTimerComment);
		console.log("SubmitUpdateDocComment!");
		this.typingTimerComment = setTimeout(() => {
			this.socketDocumentService.sendChangesComment(JSON.stringify(this.currentDocument));
		}, this.TIMEOUT_DELAY);
	}

	onContentChange(editableDiv: HTMLElement) {
		this.currentDocument.content = editableDiv.innerHTML;
		this.submitUpdateDoc();
	}
}
