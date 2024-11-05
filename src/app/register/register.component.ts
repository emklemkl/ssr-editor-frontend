import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registrering lyckades:', response);
        this.successMessage = 'Registreringen lyckades! Du kan nu logga in.';
        this.errorMessage = null;
        
        // Om JWT hanteras genom att spara det i local storage eller session storage
        if (response.token) {
          localStorage.setItem('token', response.token); // Spara token i local storage
        }

        // Navigera till inloggningssidan efter 2 sekunder
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error) => {
        console.error('Registrering misslyckades:', error);
        this.errorMessage = error.error.message || 'Något gick fel vid registreringen';
        this.successMessage = null;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
