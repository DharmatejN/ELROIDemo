import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { SpinnerService } from '../spinner/spinner.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorHandler implements HttpInterceptor {

    constructor(
        private spinnerSvc: SpinnerService,
        private authenticationSvc: AuthenticationService,
        private router: Router,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // this.spinnerSvc.open();

        return next
            .handle(req)
            .pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // this.spinnerSvc.close();
                    }
                }, (error) => {
                    // console.log(error);
                    // this.spinnerSvc.close();
                }), catchError(err => {
                    // console.log(err);
                    // this.spinnerSvc.close();
                    const error = err.statusText;
                    if (err.status === 401) {
                        // auto logout if 401 response returned from api
                        this.authenticationSvc.logout();
                        location.reload(true);
                    } else if (err.status === 403) {
                        this.router.navigate(['/forbidden/' + error]);
                    }
                    return throwError(error);
                })
            );
    }
}