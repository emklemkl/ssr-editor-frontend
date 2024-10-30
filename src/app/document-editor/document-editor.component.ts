import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentDetailsComponent } from 'app/document-details/document-details.component';
import { AuthService } from '@services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '@services/document.service';

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, DocumentDetailsComponent],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss'
})
export class DocumentEditorComponent implements OnInit {
  documentId: string | null = null;
  isAuthenticated = false;
  document: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private documentService: DocumentService
  ) {}

  // ngOnInit(): void {
  //   this.documentId = this.route.snapshot.paramMap.get("id");
  //   console.log("Document ID:", this.documentId);

  //   this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
  //     this.isAuthenticated = isAuthenticated;
  //     if (!isAuthenticated) {
  //       const redirectUrl = encodeURIComponent(`/document/${this.documentId}/edit`);
  //       window.location.href = `http://localhost:5000/auth/google?redirect=${redirectUrl}`;
  //       // const redirectUrl = `/document/${this.documentId}/edit`;
  //       // this.router.navigate(['/login'], { queryParams: { redirect: redirectUrl } });
  //     }
  //   });
  // }
  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get("id");
    console.log("Document ID:", this.documentId);

    if (!this.documentId) {
        console.error('Document ID is undefined');
        return; // Stoppa vidare exekvering
    }

    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (!isAuthenticated) {
            const redirectUrl = encodeURIComponent(`/document/${this.documentId}/edit`);
            window.location.href = `http://localhost:5000/auth/google?redirect=${redirectUrl}`;
        } else {
            this.documentService.getDocument(this.documentId).subscribe(
                (data) => {
                    this.document = data;
                    console.log('Fetched Document:', this.document);
                },
                (error) => {
                    console.error('Error fetching document:', error);
                }
            );
        }
    });
}

}
