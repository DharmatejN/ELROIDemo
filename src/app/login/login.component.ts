import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authenticate } from '../model/authentication';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { MatDialog } from '@angular/material';
import { CustomErrorStateMatcher } from '../core/material/CustomErrorStateMatcher';
import { ElalertComponent } from '../customized/elalert/elalert.component';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/toast/messageservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public authSvc: AuthenticationService,
    private toastSvc: MessageService,
    private fb: FormBuilder,

  ) {

  }

  signInForm: FormGroup;

  login = new FormControl('', [
    Validators.required,
  ]);
  loginpassword = new FormControl('', [
    Validators.required,
  ]);

  matcher = new CustomErrorStateMatcher();

  username: string;
  password: string;
  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
    this.authSvc.logout();
    this.BuildFormControls();
  }

  BuildFormControls() {
    this.signInForm = this.fb.group({
      login: ['ramesh.rao', [Validators.required]],
      loginpassword: ['pa55w0rd!!', [Validators.required]]
    });
  }

  register(): void {
    this.toastSvc.add({
      severity: 'warn', summary: 'Success Message',
      detail: 'Hi, ' + this.username + ' you cannot register. Please contact administrator.'
    });
    // const dialogClose = this.dialog.open(ElalertComponent, {
    //   disableClose: true, data: {
    //     Label: 'Hi, <b>' + this.username + '</b> you cannot register.</br>please contact admin to have right to register.',
    //     ok: 'Ok', username: this.username
    //   }
    //   , panelClass: 'elalert'
    // });
    // dialogClose.afterClosed().subscribe(result => {
    // });
  }

  loginConfirm(): void {
    if (this.username !== undefined && this.password !== undefined) {
      const req: Authenticate = { userName: this.username, passWord: this.password };
      this.authSvc.authenticateuser(req).subscribe(
        (data) => {
          if (data !== undefined && data != null) {
            if (data.errorMsg != null && data.errorMsg !== '') {
              const dialogClose = this.dialog.open(ElalertComponent, {
                disableClose: true, data: {
                  Label: 'Hi, <b>' + this.username + '</b> you are not an authenticate user.</br>please contact administrator to login.',
                  ok: 'Ok', username: this.username
                }
                , panelClass: 'elalert'
              });
              dialogClose.afterClosed().subscribe(result => {
              });
            } else {
              sessionStorage.setItem(this.envKey.toString() + 'jwtloginToken', data.token);
              this.router.navigate(['/menu/dashboard']);
            }
          }
        }
      );
    }
  }

}
