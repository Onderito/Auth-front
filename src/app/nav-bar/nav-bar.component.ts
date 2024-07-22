import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  isAuthenticated: boolean = false;

  constructor(protected userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated; // Mettre à jour l'état de l'authentification
      console.log('User authenticated:', isAuthenticated); // Pour débogage
    });
  }

  logout() {
    this.userService.logout(); // Déconnecter l'utilisateur
    console.log('User logged out'); // Pour débogage
    this.router.navigate(['/login']);
  }
}
