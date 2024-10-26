import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user:any;
  isLoading = true;
  error: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .subscribe({
      next: (data) => {
        console.log('User data:', data);
        this.user = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Ingen användare inloggad';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = 'http://localhost:4200/login';
    }, error => {
      console.error('Loggout error:', error);
      
    });
  }
}
