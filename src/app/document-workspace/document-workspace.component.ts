import { Component, Input } from "@angular/core";
import { DocumentService } from "@services/document.service";
import { DocumentDetailsComponent } from "app/document-details/document-details.component";
import { Observable } from "rxjs";
import { Document } from "@interfaces/document";
@Component({
	selector: "app-document-workspace",
	standalone: true,
	imports: [DocumentDetailsComponent],
	template: `
		<div>
			<app-document-details [document$]="this.document$" [id]="this.id"></app-document-details>
			<!-- <app-document-details [id]="id" [isComment]="isComment"></app-document-details> -->
		</div>
	`,
	styleUrl: "./document-workspace.component.scss"
})
export class DocumentWorkspaceComponent {
	@Input() id = "";
	@Input() document$!: Observable<Document>;
	constructor(private documentService: DocumentService) {}

	ngOnInit() {
		this.document$ = this.documentService.getDocument(this.id);
	}
}
