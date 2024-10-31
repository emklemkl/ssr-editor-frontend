import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

// export class LoginComponent {
export class LoginComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        const redirectUrl = params['redirect'];
        if (redirectUrl) {
            localStorage.setItem('redirectUrl', redirectUrl);
        }
    });
  }

  loginWithGoogle() {
    window.location.href = 'https://js-emlo-f6byg8hvbvhahgfp.northeurope-01.azurewebsites.net/auth/google';
    // window.location.href = 'http://localhost:5000/auth/google';
  }
}
