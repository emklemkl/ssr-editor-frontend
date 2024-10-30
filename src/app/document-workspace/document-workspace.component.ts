import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { DocumentDetailsComponent } from "app/document-details/document-details.component";
import { Observable, shareReplay } from "rxjs";
import { Document } from "@interfaces/document";
import { ContentModifierComponent } from "../content-modifier/content-modifier.component";
import { KeyValuePipe, NgFor } from "@angular/common";
import { SocketDocumentService } from "@services/socket-document.service";
import { firstValueFrom } from "rxjs";
@Component({
	selector: "app-document-workspace",
	standalone: true,
	imports: [DocumentDetailsComponent, ContentModifierComponent, NgFor, KeyValuePipe],
	template: `
		<main class="workspace">
			<!-- <app-content-modifier (commentCreated)="onCommentAdd($event)"></app-content-modifier> -->
			<app-document-details
				[document$]="this.document$"
				[id]="this.id"
				(commentCreated)="onCommentCreated()"
				(commentDeleted)="onCommentDeleted($event)"
			></app-document-details>
			<section class="comment-section">
				<div #commentSection>
					<app-document-details
						*ngFor="let comment of existingComments | keyvalue"
						(commentDeleted)="onCommentDeleted($event)"
						[existingComment]="comment"
						[document$]="this.document$"
						[id]="this.id"
						[richTextAllowed]="false"
						[commentAdded]="this.commentAdded"
					></app-document-details>
				</div>
			</section>
		</main>
	`,
	styleUrl: "./document-workspace.component.scss"
})
export class DocumentWorkspaceComponent {
	@Input() id = "";
	@Input() document$!: Observable<Document>;
	commentAdded!: number;
	@ViewChild("commentSection", { read: ViewContainerRef, static: true })
	commentSection!: ViewContainerRef;
	constructor(
		private documentService: DocumentService,
		private socketDocumentService: SocketDocumentService
	) {}
	existingComments: { [key: string]: string } = {};
	ngOnInit() {
		this.document$ = this.documentService.getDocument(this.id).pipe(
			shareReplay({ bufferSize: 1, refCount: true, windowTime: 2000 }) // 2 seconds cache duration
		);
		this.document$.subscribe((document) => this.extractComments(document));
	}

	fetchComments() {
		this.existingComments = {};
		this.documentService.getDocument(this.id).subscribe((document) => this.extractComments(document));
	}
	// This method will be triggered when the child component emits the event
	onCommentCreated() {
		this.fetchComments(); // Re-fetch comments from the database
	}

	async onCommentDeleted($event: any) {
		await this.socketDocumentService.sendDeleteComment(JSON.stringify({ _id: this.id, comments: $event }));
		const documentData = await this.documentService.getDocument(this.id);
		const result = await firstValueFrom(documentData);
		let div: any  = document.createElement("div");
		div.innerHTML = result.content
		let spanToRemove: Element | null = div.querySelector(`#spanId${$event}`);
		console.log("🚀 ~ DocumentWorkspaceComponent ~ onCommentDeleted ~ result.content:", result.content)
		if (spanToRemove) {
			spanToRemove.replaceWith(spanToRemove.textContent || "");
			result.content = div.innerHTML
		}
		console.log("🚀 ~ DocumentWorkspaceComponent ~ onCommentDeleted ~ result.content:", result.content)
		this.document$ = new Observable((observer) => {
			observer.next(result);
			observer.complete();
		});
		this.document$.subscribe((document) => {
			console.log(">>>>>", document);
		});
		// console.log("🚀 ~ DocumentWorkspaceComponent ~ onCommentDeleted ~ this.document$:", this.document$);
		this.fetchComments();
	}

	extractComments(document: any) {
		if (document.comments) {
			for (const [key, value] of Object.entries(document.comments)) {
				this.existingComments[key] = `${value}`;
			}
		}
	}
}
