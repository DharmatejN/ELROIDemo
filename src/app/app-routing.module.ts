import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { StocksComponent } from './stocks/stocks.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
const routes: Routes = [{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{
  path: 'menu',
  component: MenuComponent,
  children: [
    { path: '', redirectTo: '/menu/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationService] },
    { path: 'stocks', component: StocksComponent, canActivate: [AuthenticationService] },

  ]
},
{ path: 'unauthorized', component: UnauthorizedComponent },
{ path: 'forbidden', component: ForbiddenComponent },
{ path: 'forbidden/:msg', component: ForbiddenComponent },
{ path: '**', component: LoginComponent }, // Un Authorised Access
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
