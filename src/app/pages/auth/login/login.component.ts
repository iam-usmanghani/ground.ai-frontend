import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  constructor(private _http: HttpClient, private service: MessageService) {

  }

  onLogIn() {


    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }
  
    const loginData = {
      email: this.email,
      password: this.password,
      rememberMe: this.checked || false
    };
  debugger
    this._http.post('http://108.181.189.229:5000/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          //alert('Login successful');
  
          if (response && response.token) { // Check if token exists in response
            localStorage.setItem('token', response.token);
            // Optional: Redirect to dashboard or another protected route
            // this.router.navigate(['/dashboard']); // Example using Angular Router
          } else {
            console.warn('Token not received in login response.');
          //  alert('Login successful, but token not received. Please check the console.');
          }
        },
        error: (error) => {
          debugger
         
          console.error('Login failed', error);
  
          let errorMessage = 'Invalid credentials. Please try again.'; // Default error message
  
          if (error && error.error && error.error.message) { // Check for specific error message from the backend
            errorMessage = error.error.message;
          } else if (error && error.message){
            errorMessage = error.message; //if there is a general error message
          }
  
         // alert(errorMessage);
        }
      });
  }

}
