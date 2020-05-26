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
import { ProfileInfoComponent } from './Medsol-Form/profile-info/profile-info.component';
import { LoginGuard } from './Medsol-Services/Guard/login.guard';
import { AuthGuard } from './Medsol-Services/Guard/auth.guard';
import { SearchPeopleComponent } from './Medsol-Dashboard/search-people/search-people.component';


const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: "signup", component: RegisterComponent, canActivate: [LoginGuard] },
  { path: "profile/:id", component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: "edit-profile", component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoginGuard] },
  { path: "", component: DashBoardComponent, canActivate: [AuthGuard] },
  { path: "peoples/:type", component: PeopleListComponent, canActivate: [AuthGuard] },
  { path: "search/:query", component: SearchPeopleComponent, canActivate: [AuthGuard] },
  { path: "profile-info/:name/:mobile/:email", component: ProfileInfoComponent, canActivate: [LoginGuard] },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
