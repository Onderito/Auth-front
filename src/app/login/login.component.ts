import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from './../service/user.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AppComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userForm: FormGroup;
  private loginSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private router: Router,
    protected messageService: MessageService
  ) {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.userService.loginUser(this.userForm.value).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          this.router.navigate(['/profile']);
          setTimeout(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success Message',
              detail: 'Order submitted',
            });
          }, 3000);
        },
        error: (error) => {
          setTimeout(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Login failed',
            });
          });
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
