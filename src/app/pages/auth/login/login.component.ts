import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, MessageModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  checked: boolean = false;

  constructor(private _http: HttpClient, private service: MessageService, private _router: Router) {

  }

  onLogIn() {
    if (!this.email || !this.password) {
      this.service.add({ severity: 'warn', summary: "Please enter email and password" });
      return;
    }
    const loginData = {
      email: this.email,
      password: this.password,
      rememberMe: this.checked || false
    };
    this._http.post('http://108.181.189.229:5000/login', loginData)
      .subscribe({
        next: (response: any) => {
          if (response && response.statusCode === 200) {
            if (response.data.access_token) {
              localStorage.setItem('accessToken', response.token);
              this._router.navigateByUrl('');
            }
          } else if (response && response.statusCode === 404) {
            this.service.add({ severity: 'warn', summary: response.message || 'Invalid credentials' });
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
