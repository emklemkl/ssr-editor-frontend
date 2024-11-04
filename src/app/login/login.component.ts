import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Förväntar att response innehåller en JWT-token
        const token = response.token;
        if (token) {
          // Spara JWT i localStorage eller sessionStorage
          localStorage.setItem('jwtToken', token);          
          // Navigera till startsidan efter lyckad inloggning
          // this.router.navigate(['/']);
          window.location.href = response.redirectUrl;
        } else {
          this.errorMessage = 'Inloggningen misslyckades. Token saknas.';
        }
      },
      error: (error) => {
        console.error('Inloggning misslyckades:', error);
        this.errorMessage = error.error.message || 'Något gick fel';
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
