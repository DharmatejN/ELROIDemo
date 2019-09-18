import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Authenticate } from 'src/app/model/authentication';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  jwtToken: string;
  private authurl = environment.authUrl;
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  constructor(private http: HttpClient, public router: Router) {

  }
  authenticateuser(credentials: Authenticate) {
    const body = JSON.stringify(credentials);
    return this.http.post<Authenticate>(this.authurl + 'authenticate/authenticatelogin', body, httpOptions);

  }
  logout() {
    sessionStorage.removeItem(this.envKey.toString() + 'jwtloginToken');
    this.jwtToken = undefined;
  }

  isLoggedIn(): boolean {
    this.jwtToken = sessionStorage.getItem(this.envKey.toString() + 'jwtloginToken');
    return this.jwtToken !== undefined && this.jwtToken != null;
  }

  canActivate(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/unauthorized']);
      return false;
    } else {
      return true;
    }
  }
}
