import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private name: string;
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) { }

  createUser(name: string, email: string, password: string) {
    // tslint:disable-next-line:object-literal-shorthand
    const authData: AuthData = { name: name, email: email, password: password };
    return this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        this.authStatusListener.next(false);
      });

  }
  login(email: string, password: string) {
    // tslint:disable-next-line:object-literal-shorthand
    const authData: AuthData = {name: name, email : email, password: password};

    this.http.post<{token: string, expiresIn: number, userId: string, name: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        // console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.name = response.name;
          console.log(this.name);
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, this.name);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['']);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getUserId() {
    return this.userId;
  }

  getname() {
    return this.name;
  }



  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.name = authInformation.name;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    if (!token || !expirationDate) {
      return;
    }
    return {
      // tslint:disable-next-line:object-literal-shorthand
      token: token,
      expirationDate: new Date(expirationDate),
      // tslint:disable-next-line:object-literal-shorthand
      userId: userId,
      // tslint:disable-next-line:object-literal-shorthand
      name: name
    };
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, name: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


}
