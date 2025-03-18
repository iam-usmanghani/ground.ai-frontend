import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, MessageModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private _http: HttpClient, private _router: Router, private service: MessageService) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSignUp() {

    const firstName = this.signupForm.get('firstName')?.value;
    const lastName = this.signupForm.get('lastName')?.value;
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    if (!firstName) {
      this.service.add({ severity: 'warn', summary: 'Please enter first name' });
      return;
    }
    if (!lastName) {
      this.service.add({ severity: 'warn', summary: 'Please enter last name' });
      return;
    }
    if (!email || !password) {
      this.service.add({ severity: 'warn', summary: 'Please enter email and password' });
      return;
    }
    if (password.length < 6) {
      this.service.add({ severity: 'warn', summary: 'Password must be at least 6 characters long' });
      return;
    }
    if (password !== confirmPassword) {
      this.service.add({ severity: 'warn', summary: 'Passwords do not match' });
      return;
    }

    let formsValue = this.signupForm.value;
    this._http.post('http://108.181.189.229:5000/register', formsValue)
      .subscribe({
        next: (response: any) => {
          if (response && response.statusCode === 201) {
            this.service.add({ severity: 'success', summary: response.message });
            setTimeout(()=>{
              this._router.navigateByUrl('auth/login');
            }, 500)
          } else {
            this.service.add({ severity: 'warn', summary: response.message });
          }
        },
        error: (error) => {
          let errorMessage = 'Invalid credentials. Please try again.'; 
          if (error && error.error && error.error.message) { 
            errorMessage = error.error.message;
          } else if (error && error.message) {
            errorMessage = error.message; 
          }
          this.service.add({ severity: 'error', summary: errorMessage });
        }
      });
  }

}
