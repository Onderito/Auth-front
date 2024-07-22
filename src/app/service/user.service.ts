import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api'; // URL de l'API
  private tokenKey = 'token'; // Clé pour stocker le token

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userSubject = new BehaviorSubject<any>(null);

  user$ = this.userSubject.asObservable();

  public getUser(): User | null {
    return this.userSubject.value;
  }

  public setUser(user: User): void {
    this.userSubject.next(user);
  }

  public clearUser(): void {
    this.userSubject.next(null);
  }

  public loginUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        const token = response.token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.isAuthenticatedSubject.next(true);
          this.setUser(response.user); // Assurez-vous que la réponse contient un utilisateur
          console.log('Logged in user:', response.user);
        } else {
          console.error('Token not found in response');
          throw new Error('Token not found');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(() => new Error('Erreur lors de la connexion.'));
        }
        return throwError(
          () => new Error("Une erreur inconnue s'est produite.")
        );
      })
    );
  }

  public registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 400 &&
          error.error.message === 'User already exists'
        ) {
          return throwError(() => new Error('Cet utilisateur existe déjà.'));
        }
        return throwError(
          () => new Error('Erreur lors de la création du user.')
        );
      })
    );
  }

  public isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.clearUser();
    console.log('Token removed');
  }

  public updateProfile(user: User): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/update`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(this.tokenKey)}`,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return throwError(
              () => new Error('Erreur lors de la mise à jour.')
            );
          }
          return throwError(
            () => new Error("Une erreur inconnue s'est produite.")
          );
        })
      );
  }
}
