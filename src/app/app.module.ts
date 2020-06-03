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
import { DashBoardComponent } from './Medsol-Dashboard/dash-board/dash-board.component';
import { PeopleListComponent } from './Medsol-Dashboard/people-list/people-list.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatMenuModule } from '@angular/material/menu';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NewPostComponent } from './Medsol-Dashboard/new-post/new-post.component';
import { IntercepterService } from './Medsol-Services/Auth/intercepter.service';
import { SearchPeopleComponent } from './Medsol-Dashboard/search-people/search-people.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DialogComponent } from './Medsol-Common/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EditPostComponent } from './Medsol-Dashboard/edit-post/edit-post.component';

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
    ConfirmDialogComponent,
    DashBoardComponent,
    PeopleListComponent,
    NewPostComponent,
    SearchPeopleComponent,
    DialogComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IntercepterService,
      multi: true
    }
  ],
  entryComponents: [
    ConfirmDialogComponent,
    EditPostComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
