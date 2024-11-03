import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}
