import { UserService } from './../service/user.service';
import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AppComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private userService: UserService, private router: Router) {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  userForm: FormGroup;
  private registerSubscription: Subscription | undefined;

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Data:', this.userForm.value);
      this.registerSubscription = this.userService
        .registerUser(this.userForm.value)
        .subscribe({
          next: (data) => {
            console.log('User registered successfully:', data);

            // Ajoutez ici la logique pour gérer la réussite de l'inscription
          },
          error: (error) => {
            console.error('Error registering user:', error);

            // Ajoutez ici la logique pour gérer l'erreur d'inscription
          },
          complete: () => {
            console.log('Subscription complete');
            this.router.navigate(['/login']);
            // Ajoutez ici la logique à exécuter lorsque l'abonnement est terminé (facultatif)
          },
        });
    }
  }

  ngOnDestroy() {
    // Assurez-vous de désabonner pour éviter les fuites de mémoire
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }
}
