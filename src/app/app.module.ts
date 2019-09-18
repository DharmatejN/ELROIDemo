import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './core/material/material.module';

import { NgxPrintModule } from 'ngx-print';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { SpinnerService } from './services/spinner/spinner.service';
import { ExporterService } from './services/export/exporter.service';
import { ElroiapiService } from './services/http/elroiapi.service';

import { HttpInterceptorHandler } from './services/http/http-interceptor';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './services/spinner/spinner.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StocksComponent } from './stocks/stocks.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ElconfirmComponent } from './customized/elconfirm/elconfirm.component';
import { ElalertComponent } from './customized/elalert/elalert.component';
import { EldialogComponent } from './customized/eldialog/eldialog.component';
import { StatsComponent } from './stats/stats.component';
import { PicklistComponent } from './picklist/picklist.component';
import { EmailComponent } from './email/email.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ToastComponent, ToastItem } from './toast/toast.component';
import { MessageService } from './services/toast/messageservice';


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    LoginComponent,
    MenuComponent,
    DashboardComponent,
    StocksComponent,
    ElconfirmComponent,
    ElalertComponent,
    EldialogComponent,
    StatsComponent,
    PicklistComponent,
    EmailComponent,
    UnauthorizedComponent,
    ForbiddenComponent,
    ToastComponent,
    ToastItem
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    NgxPrintModule,
    MaterialFileInputModule,
  ],
  entryComponents: [
    AppComponent,
    SpinnerComponent,
    ElalertComponent,
    ElconfirmComponent,
    EldialogComponent,
    EmailComponent
  ],
  providers: [ElroiapiService, ExporterService, SpinnerService, AuthenticationService, MessageService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorHandler,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
