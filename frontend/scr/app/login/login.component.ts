import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Please fill both fields.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/home']);
      },
      (err) => {
        this.error = err.error?.message || 'Login failed.';
      }
    );
  }
}
