import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './Medsol-Common/page-not-found/page-not-found.component';
import { LoginComponent } from './Medsol-Form/login/login.component';
import { DashBoardComponent } from './Medsol-Dashboard/dash-board/dash-board.component';
import { RegisterComponent } from './Medsol-Form/register/register.component';
import { ForgotPasswordComponent } from './Medsol-Form/forgot-password/forgot-password.component';
import { ProfilePageComponent } from './Medsol-Profile/profile-page/profile-page.component';
import { EditProfileComponent } from './Medsol-Profile/edit-profile/edit-profile.component';
import { PeopleListComponent } from './Medsol-Dashboard/people-list/people-list.component';


const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: RegisterComponent },
  { path: "profile", component: ProfilePageComponent },
  {path: "edit-profile",component:EditProfileComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: "", component: DashBoardComponent }, 
  { path: "peoples", component: PeopleListComponent },
  { path: "", component: DashBoardComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
