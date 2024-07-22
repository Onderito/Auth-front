import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialisez le formulaire réactif
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required, Validators.minLength(8)],
    });
  }

  passwordError() {
    return this.profileForm.get('password')?.errors;
  }

  ngOnInit(): void {
    // Abonnez-vous pour obtenir les informations de l'utilisateur
    this.userService.user$.subscribe((user) => {
      this.user = user;
      // Mettez à jour le formulaire avec les données de l'utilisateur
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          password: user.password,
        });
      }
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('profile updated');
      },
    });
  }
}
