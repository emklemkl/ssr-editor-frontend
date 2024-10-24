import { Component, Input } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { DocumentDetailsComponent } from "app/document-details/document-details.component";
import { Observable, shareReplay } from "rxjs";
import { Document } from "@interfaces/document";
import { ContentModifierComponent } from "../content-modifier/content-modifier.component";
@Component({
	selector: "app-document-workspace",
	standalone: true,
	imports: [DocumentDetailsComponent, ContentModifierComponent],
	template: `
		<div class="workspace">
			<app-content-modifier (commentCreated)="onCommentAdd($event)"></app-content-modifier>
			<app-document-details [document$]="this.document$" [id]="this.id"></app-document-details>
			<app-document-details
				[document$]="this.document$"
				[id]="this.id"
				[richTextAllowed]="false"
				[commentAdded]="this.commentAdded"
			></app-document-details>
		</div>
	`,
	styleUrl: "./document-workspace.component.scss"
})
export class DocumentWorkspaceComponent {
	@Input() id = "";
	@Input() document$!: Observable<Document>;
	commentAdded!: number;
	constructor(private documentService: DocumentService) {}

	ngOnInit() {
		this.document$ = this.documentService.getDocument(this.id).pipe(
			shareReplay({ bufferSize: 1, refCount: true, windowTime: 2000 }) // 2 seconds cache duration
		);
		this.document$.subscribe((document) => {
			if (document.comments) {
				console.log("\n\n DOCUMENT__", document);
				for (const doc of document.comments) {
					console.log(doc);
				}
			}
		});
	}
	onCommentAdd(commentId: number) {
		this.commentAdded = commentId;
		console.log("Comment added with ID:", this.commentAdded);
	}
}
