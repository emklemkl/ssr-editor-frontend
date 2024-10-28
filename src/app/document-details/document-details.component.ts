import { CommonModule, NgIf } from "@angular/common";
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Document } from "@interfaces/document";
import { DocumentService } from "@services/document.service";
import { SocketDocumentService } from "@services/socket-document.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-document-details",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, NgIf, FormsModule],
	templateUrl: "./document-details.component.html",
	// template: ``,
	styleUrl: "./document-details.component.scss"
})

export class DocumentDetailsComponent implements OnInit, OnChanges {
	@Input() id = "";
	document$!: Observable<Document>;
	currentDocument: Document = { _id: this.id, title: "", content: "" };
	typingTimer!: ReturnType<typeof setTimeout>;
	public TIMEOUT_DELAY = 500;
	constructor(
		private documentService: DocumentService,
		private socketDocumentService: SocketDocumentService,
		private http: HttpClient
	) {}

	ngOnInit(): void {
		this.document$ = this.documentService.getDocument(this.id);

		this.document$.subscribe((document) => {
			console.log('Loaded document:', document);
			this.currentDocument._id = this.id;
			this.currentDocument.title = document.title;
			this.currentDocument.content = document.content;
		});

		this.socketDocumentService.createRoom(this.id);

		// Subscribes to textarea and input and reacts to changes.
		this.socketDocumentService.getChanges().subscribe((msg: any ) => {
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

	isShareModalOpen = false;
    inviteEmail: string = '';

    openShareModal() {
        this.isShareModalOpen = true;
    }

    closeShareModal() {
        this.isShareModalOpen = false;
        this.inviteEmail = '';
    }

	sendInvitation() {
		const documentId = this.currentDocument._id;  // Använd _id från currentDocument
	
		if (!documentId) {
			alert("Dokument-ID saknas.");
			return;
		}

		const apiUrl = `http://localhost:5000/document/${documentId}/invite`;
	
		this.http.post(apiUrl, { email: this.inviteEmail }, { withCredentials: true })
			.subscribe({
				next: () => {
					alert('Inbjudan skickad!');
					this.closeShareModal();
				},
				error: () => alert('Kunde inte skicka inbjudan.')
			});
	}
	
}
