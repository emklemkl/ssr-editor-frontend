import { CommonModule, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
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
			<button type="button" (click)="spanWrapper('bold')" class="bold">B</button>
			<button type="button" (click)="spanWrapper('cursive')" class="cursive">k</button>
			<button type="button" (click)="spanWrapper('underscore')" class="underscore">U</button>
			<button type="button" (click)="spanWrapper('comment')">Comment</button>
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
				<button type="button" (click)="deleteComment(existingComment.key)" class="delete-comment">
					X
				</button>
				<textarea
					id="comment {{ this.existingComment.key }}"
					(input)="submitUpdateDocCommentFromEvent($event)"
					#comment
					>{{ this.existingComment.value }}</textarea
				>
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
	@Input() existingComment?: any;
	@Output() commentCreated = new EventEmitter<void>();
	@Output() commentDeleted = new EventEmitter<string>();
	newestContent: any;
	currentDocument: Document = { _id: this.id, title: "", content: "", comments: this.existingComment };
	typingTimer!: ReturnType<typeof setTimeout>;
	typingTimerComment!: ReturnType<typeof setTimeout>;
	TIMEOUT_DELAY = 500;
	constructor(
		private documentService: DocumentService,
		private socketDocumentService: SocketDocumentService,
		private renderer: Renderer2
	) {}

	deleteComment(idToRemove: string) {
		console.log("idToRemove", idToRemove);
		this.commentDeleted.emit(idToRemove);
	}

	ngOnInit(): void {
		console.log("🚀 ~ DocumentDetailsComponent ~ existingComment:", this.existingComment);
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
			} else if (change === "commentAdded") {
				console.log("commentAdded", change);
				// this.submitUpdateDoc();

				console.log("CONTENT", this.newestContent);
				// this.submitUpdateDocComment();
			}
		}
	}

	submitUpdateDoc() {
		clearTimeout(this.typingTimer);
		this.typingTimer = setTimeout(() => {
			this.socketDocumentService.sendChanges(JSON.stringify(this.currentDocument));
		}, this.TIMEOUT_DELAY);
	}

	submitUpdateDocCommentFromEvent(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		const commentValue = target?.value || ""; // Fallback to an empty string if null
		const commentId = target?.id || ""; // Fallback to an empty string if null
		this.submitUpdateDocComment({ [commentId]: commentValue });
	}

	submitUpdateDocComment(comment: any) {
		console.log("this.submitUpdateDocComment:", comment);
		clearTimeout(this.typingTimerComment);
		this.typingTimerComment = setTimeout(() => {
			this.socketDocumentService.sendChangesComment(
				JSON.stringify({ _id: this.currentDocument._id, comments: comment })
			);
		}, this.TIMEOUT_DELAY);
	}

	onContentChange(editableDiv: HTMLElement) {
		this.currentDocument.content = editableDiv.innerHTML;
		this.submitUpdateDoc();
	}

	async onCommentCreate(id: string) {
		const payload = {
			_id: this.id,
			comments: { [id]: `Preset comment ${id}` }
		};
		await this.socketDocumentService.sendCreateComment(JSON.stringify(payload));
		this.commentCreated.emit();
	}

	async spanWrapper(type: "bold" | "comment" | "cursive" | "underscore") {
		let selection: Selection | null = window.getSelection();
		const COMMENT = "comment";
		let commentId: any;
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			let span = this.renderer.createElement("span");
			if (type == COMMENT) {
				commentId = document.getElementsByClassName(COMMENT).length + 1;
				this.renderer.addClass(span, commentId.toString());
			}
			this.renderer.addClass(span, type);
			span.innerHTML = range.toString();
			range.deleteContents();
			range.insertNode(span);
			this.submitUpdateDoc();
			if (type == COMMENT) {
				setTimeout(() => {
					this.onCommentCreate(commentId.toString());
				}, 600);
			}
			this.setCursorPos(span, selection);
		}
	}
	setCursorPos(span: HTMLSpanElement, selection: Selection) {
		// Set cursor to start outside the newly created <span>
		const space = this.renderer.createText("\u200B");
		span.parentNode!.insertBefore(space, span.nextSibling);
		const newRange = document.createRange();
		newRange.setStartAfter(space);
		newRange.collapse(true);
		selection.removeAllRanges();
		selection.addRange(newRange);
		this.onContentChange(span.parentNode as HTMLElement);
	}
}
