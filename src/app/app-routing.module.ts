import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './Medsol-Common/page-not-found/page-not-found.component';
import { LoginComponent } from './Medsol-Form/login/login.component';


const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
