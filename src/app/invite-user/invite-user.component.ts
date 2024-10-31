import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invite-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-user.component.html',
  styleUrl: './invite-user.component.scss'
})
export class InviteUserComponent {
  @Input() documentId: string = '';
  @Output() invitationSent = new EventEmitter<void>();
  inviteEmail: string = '';
  isShareModalOpen = false;

  constructor(private http: HttpClient) {}

  openShareModal() {
    this.isShareModalOpen = true;
  }

  closeShareModal() {
    this.isShareModalOpen = false;
    this.inviteEmail = '';
  }

  sendInvitation() {
    if (!this.documentId) {
      alert("Dokument-ID saknas.");
      return;
    }

    const apiUrl = `https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net/document/${this.documentId}/invite`;
    // const apiUrl = `http://localhost:5000/document/${this.documentId}/invite`;

    this.http.post(apiUrl, { email: this.inviteEmail }, { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Inbjudan skickad!');
          this.closeShareModal();
          this.invitationSent.emit(); // Meddela att inbjudan har skickats
        },
        error: () => alert('Kunde inte skicka inbjudan.')
      });
  }
}
