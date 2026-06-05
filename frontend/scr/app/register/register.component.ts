import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.error = '';

    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill all fields.';
      return;
    }

    this.authService.register(this.name, this.email, this.password).subscribe(
      (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/home']);
      },
      (err) => {
        this.error = err.error?.message || 'Registration failed.';
      }
    );
  }
}
