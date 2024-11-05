import { Component, EventEmitter, Input, Output } from '@angular/core'; 
import { AuthService } from '@services/auth.service'; // Importera AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invite-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent {
  @Input() documentId: string = '';
  @Output() invitationSent = new EventEmitter<void>();
  inviteEmail: string = '';
  isShareModalOpen = false;

  constructor(private authService: AuthService) {}

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

    this.authService.sendInvitation(this.documentId, this.inviteEmail).subscribe({
      next: (response) => {
        console.log('Response invite:', response);
        
        console.log('Inbjudan skickad:', response);
        alert('Inbjudan skickad till användaren!');
      },
      error: (error) => {
        console.error('Fel vid försök att skicka inbjudan:', error);
        alert('Ett fel inträffade vid skickandet av inbjudan. Försök igen.');
      },

      complete: () => {
        console.log('Förfrågan avslutad');
      }
    });
  }
}
