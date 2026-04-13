import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };
  error = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.apiService.register(this.user).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Registration failed. Please check your details.';
      }
    });
  }
}
