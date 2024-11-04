import { CommonModule, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Document } from "@interfaces/document";
import { DocumentService } from "@services/document.service";
import { SocketDocumentService } from "@services/socket-document.service";
import { ContentModifierComponent } from "app/content-modifier/content-modifier.component";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { InviteUserComponent } from "app/invite-user/invite-user.component";


@Component({
	selector: "app-document-details",
	standalone: true,

	imports: [CommonModule, ReactiveFormsModule, NgIf, FormsModule, ContentModifierComponent, InviteUserComponent],
	template: `
		@if (richTextAllowed) {
			<app-invite-user
			[documentId]="currentDocument._id"
			(invitationSent)="onInvitationSent()">
			</app-invite-user>
			<section class="text-fields" *ngIf="document$ | async as document">
				<input
				type="text"
				(input)="submitUpdateDoc()"
				[(ngModel)]="currentDocument.title"
				placeholder="Title"
				/>
				<div>

					<button type="button" (click)="spanWrapper('bold')" class="button-mod bold">B</button>
					<button type="button" (click)="spanWrapper('cursive')" class="button-mod cursive">k</button>
					<button type="button" (click)="spanWrapper('underscore')" class="button-mod underscore">U</button>
					<button type="button" (click)="spanWrapper('comment')" class="button-mod">Comment</button>
				</div>
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
				<button type="button" (click)="onCommentDelete(existingComment.key)" class="delete-comment">X</button>
				<textarea
					id="{{ this.existingComment.key }}"
					class="comment commentBox{{ this.existingComment.key }}"
					(input)="submitUpdateDocCommentFromEvent($event)"
					#comment
					>{{ this.existingComment.value }}</textarea
				>
			</section>
		}
	`,

	// templateUrl: "./document-details.component.html",
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
	currentDocument: Document = { _id: this.id, title: "", content: "", comments: this.existingComment, ownerId: "", editors: []  };


	typingTimer!: ReturnType<typeof setTimeout>;
	typingTimerComment!: ReturnType<typeof setTimeout>;
	TIMEOUT_DELAY = 500;
	constructor(
		private documentService: DocumentService,
		private socketDocumentService: SocketDocumentService,

		private renderer: Renderer2,
		private elRef: ElementRef,
		private cdr: ChangeDetectorRef,
		private http: HttpClient

	) {}

	onCommentDelete(commentId: string) {
		this.commentDeleted.emit(commentId);
	}

	deleteComment(idToRemove: string) {
		const querySel = `#spanId${idToRemove}`;
		const container = document.createElement("div");
		container.innerHTML = this.newestContent;
		let spanToRemove: Element | null = container.querySelector(`#spanId${idToRemove}`);
		if (spanToRemove) {
			spanToRemove.replaceWith(spanToRemove.textContent || "");
			this.cdr.detectChanges();
			// this.updateEditableDivContent()
			const editableDiv = document.querySelector(".editable-content") as HTMLElement;
			this.commentDeleted.emit(idToRemove);
			setTimeout(() => {
				this.currentDocument.content = container.innerHTML;
				this.newestContent = container.innerHTML;
				editableDiv.innerHTML = container.innerHTML;
				this.submitUpdateDoc(container.innerHTML);
			}, 500);
			// this.ngOnInit();
			// this.updateEditableDivContent();
		} else {
			console.error(`No span found with selector: ${querySel}`);
		}
	}
	// deleteComment(idToRemove: string) {
	// 	console.log("idToRemove", idToRemove);
	// 	const querySel = `#spanId${idToRemove}`;
	// 	const container = document.createElement("div");
	// 	container.innerHTML = this.newestContent;
	// 	let spanToRemove: Element | null = container.querySelector(`#spanId${idToRemove}`);
	// 	if (spanToRemove) {
	// 		spanToRemove.replaceWith(spanToRemove.textContent || "");
	// 		this.cdr.detectChanges();
	// 		// this.updateEditableDivContent()
	// 		const editableDiv = document.querySelector(".editable-content") as HTMLElement;
	// 		this.commentDeleted.emit(idToRemove);
	// 		setTimeout(() => {
	// 			this.currentDocument.content = container.innerHTML;
	// 			this.newestContent = container.innerHTML;
	// 			editableDiv.innerHTML = container.innerHTML;
	// 			this.submitUpdateDoc(container.innerHTML);
	// 		}, 500);
	// 		// this.ngOnInit();
	// 		// this.updateEditableDivContent();
	// 	} else {
	// 		console.error(`No span found with selector: ${querySel}`);
	// 	}
	// }

	ngOnInit(): void {
		this.document$.subscribe((document) => {
			console.log('Loaded document:', document);
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
		this.socketDocumentService.getCommentChanges().subscribe((msg: any) => {
			console.log("msg", msg);
			console.log("this.existingComment", this.existingComment);
			console.log(
				"🚀 ~ DocumentDetailsComponent ~ this.socketDocumentService.getCommentChanges ~ this.existingComment.key:",
				this.existingComment.key
			);
			const commentKey = this.existingComment.key;
			const comments = msg.comments; // assuming `msg` is the object shown in your console log

			if (comments && comments[commentKey]) {
				this.existingComment.value = comments[commentKey];
			}
			// this.existingComment
			this.updateEditableDivContent();
		});
	}

	updateEditableDivContent() {
		const editableDiv = document.querySelector(".editable-content") as HTMLElement;
		this.newestContent = this.newestContent.replace(/&nbsp;+/g, " ").trim();
		if (editableDiv && editableDiv.innerHTML !== this.newestContent) {
			// editableDiv.innerHTML = this.newestContent;

			editableDiv.innerHTML = this.newestContent.replace(/\u200B/g, "");
		}
	}
	ngOnChanges(simpleChanges: SimpleChanges): void {
		for (const change in simpleChanges) {
			if (change === "id") {
				this.document$ = this.documentService.getDocument(this.id);
				this.document$.subscribe((document) => {
					this.currentDocument._id = this.id;
					this.currentDocument.title = document.title;
					this.currentDocument.content = document.content;
					this.updateEditableDivContent();
				});
				this.socketDocumentService.createRoom(this.id);
			} else if (change === "commentAdded") {
				// this.submitUpdateDoc();
				// this.submitUpdateDocComment();
			}
		}
		if (simpleChanges["document$"]) {
			this.document$.subscribe((doc) => {
				this.newestContent = doc.content || "";
				this.cdr.detectChanges();
			});
		}
	}

	submitUpdateDoc(setContent: any = "") {
		if (setContent) {
			this.currentDocument.content = setContent;
		}
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
			comments: { [id]: `Write your comment..` }
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
				this.renderer.setAttribute(span, "id", `spanId${commentId}`);
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
	onInvitationSent() {
		console.log("En inbjudan har skickats.");
		// Eventuellt uppdatera UI eller hantera något annat
	}
}
