import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Medsol-Form/login/login.component';
import { RegisterComponent } from './Medsol-Form/register/register.component';
import { ForgotPasswordComponent } from './Medsol-Form/forgot-password/forgot-password.component';
import { ProfileInfoComponent } from './Medsol-Form/profile-info/profile-info.component';
import { UploadDocumentComponent } from './Medsol-Form/upload-document/upload-document.component';
import { ProfilePageComponent } from './Medsol-Profile/profile-page/profile-page.component';
import { EditProfileComponent } from './Medsol-Profile/edit-profile/edit-profile.component';
import { PageNotFoundComponent } from './Medsol-Common/page-not-found/page-not-found.component';
import { ConfirmDialogComponent } from './Medsol-Common/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProfileInfoComponent,
    UploadDocumentComponent,
    ProfilePageComponent,
    EditProfileComponent,
    PageNotFoundComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
