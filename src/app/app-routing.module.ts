import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './Medsol-Common/page-not-found/page-not-found.component';
import { LoginComponent } from './Medsol-Form/login/login.component';
import { DashBoardComponent } from './Medsol-Dashboard/dash-board/dash-board.component';
import { RegisterComponent } from './Medsol-Form/register/register.component';
import { ForgotPasswordComponent } from './Medsol-Form/forgot-password/forgot-password.component';


const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: "", component: DashBoardComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
