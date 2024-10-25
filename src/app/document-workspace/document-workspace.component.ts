import { Component, Input } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { DocumentDetailsComponent } from "app/document-details/document-details.component";
import { Observable, shareReplay } from "rxjs";
import { Document } from "@interfaces/document";
import { ContentModifierComponent } from "../content-modifier/content-modifier.component";
import { KeyValuePipe, NgFor } from "@angular/common";
@Component({
	selector: "app-document-workspace",
	standalone: true,
	imports: [DocumentDetailsComponent, ContentModifierComponent, NgFor, KeyValuePipe],
	template: `
		<div class="workspace">
			<app-content-modifier (commentCreated)="onCommentAdd($event)"></app-content-modifier>
			<app-document-details [document$]="this.document$" [id]="this.id"></app-document-details>
			<div>
			<app-document-details
				*ngFor="let comment of existingComments | keyvalue"
				[existingComment]="comment"
				[document$]="this.document$"
				[id]="this.id"
				[richTextAllowed]="false"
				[commentAdded]="this.commentAdded"
			></app-document-details>

			</div>
		</div>
	`,
	styleUrl: "./document-workspace.component.scss"
})
export class DocumentWorkspaceComponent {
	@Input() id = "";
	@Input() document$!: Observable<Document>;
	commentAdded!: number;
	constructor(private documentService: DocumentService) {}
	existingComments: { [key: string]: string } = {};
	ngOnInit() {
		this.document$ = this.documentService.getDocument(this.id).pipe(
			shareReplay({ bufferSize: 1, refCount: true, windowTime: 2000 }) // 2 seconds cache duration
		);
		this.document$.subscribe((document) => {
			if (document.comments) {
				console.log("\n\n DOCUMENT__", document);
				for (const [key, value] of Object.entries(document.comments)) {
					this.existingComments[key] = `${value}`;
					console.log(`${key}: ${value}`);
				}
				console.log(
					"🚀 ~ DocumentWorkspaceComponent ~ this.document$.subscribe ~ this.existingComments:",
					this.existingComments
				);
			}
		});
	}
	onCommentAdd(commentId: number) {
		this.commentAdded = commentId;
		console.log("Comment added with ID:", this.commentAdded);
	}
}
