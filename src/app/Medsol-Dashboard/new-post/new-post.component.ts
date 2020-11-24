import { Component, OnInit } from '@angular/core';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { Router } from '@angular/router';
import { DashBoardComponent } from '../dash-board/dash-board.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LogoutService } from './../../Medsol-Services/Common/logout.service';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { SharedVarService } from 'src/app/Medsol-Services/Common/shared-var.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  progress: number = 0;
  dasboard: DashBoardComponent
  message = '';
  imageURL: string;
  fileData: File;
  userId;
  progressInfos = 0;
  specializations: any;
  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router,
    private _ls: LogoutService,
    private _http: HttpClient,
    private _bs: SharedVarService
  ) { }


  ngOnInit() {
    console.log("Hello")
    this.userId = localStorage.getItem('id');
    this.getAllSpecialization();
    this.getUserSpecialization();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'specializationId',
      textField: 'specializationName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  getUserSpecialization() {
    this._as.getRequest(APIEndpoints.SPECIALIZATION_BY_USER + this.userId).subscribe(
      response => { if (response.status == 200 && response.message == 'Success') this.selectedItems = response.result; },
      error => { this._ns.showSnakBar(Constant.SERVER_ERROR, "") })
  }

  onFileChanged(event) {
    const reader = new FileReader();
    this.fileData = <File>event.target.files[0];
    reader.readAsDataURL(this.fileData);
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
  }

  deleteImage() {
    this.fileData = null;
    this.imageURL = '';
  }

  postStatus() {
    if (this.message == '') {
      this._ns.showSnakBar('Please add description', '');
      return;
    } if (this.selectedItems.length == 0) {
      this._ns.showSnakBar('Please add Post Type', '');
      return;
    }
    const formData = new FormData();
    if (this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    formData.append('content', this.message);
    formData.append('type', JSON.stringify(this.selectedItems));
    this.post(APIEndpoints.UPLOAD_POST + this.userId, formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.progress = 0;
          this._bs.uploadPost.next(event.body);
          this.imageURL = '';
          this.message = '';
          // this.fileInfos = this.uploadService.getFiles();
        }
      },

      // (event: HttpEvent<any>) => {
      //   switch (event.type) {
      //     case HttpEventType.Sent:
      //       this._ns.showSnakBar(Constant.UPLOADED_SUCCESSFULLY, '');
      //       // this.imageURL = '';
      //       // this.message = '';
      //       // this.dasboard.getSuggetions();
      //       break;
      //     case HttpEventType.UploadProgress:
      //       this.progress = Math.round(event.loaded / event.total * 100);
      //       break;
      //     case HttpEventType.Response:
      //       console.log(event.body);
      //       setTimeout(() => {
      //         this.progress = 0;
      //       }, 1500);
      //   }
      // },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout() } else { this._ns.showSnakBar(Constant.SERVER_ERROR, '') } });

    // this._as.postRequest(APIEndpoints.UPLOAD_POST + this.userId, formData).subscribe(

    //   data => {
    //     if (data.status == 200) {
    //     this._ns.showSnakBar(Constant.UPLOADED_SUCCESSFULLY, ''); 
    //   } this.imageURL = '';  this.message = ''; this.dasboard.getSuggetions(); },
    //   error => {if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()} else {this._ns.showSnakBar(Constant.SERVER_ERROR, '')}});
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems)
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  /**
   * @author Swarup Bhol
   * 
   * @purpose get all specialization
   * 
   * @returns void
   */
  getAllSpecialization() {
    this._as.getRequest(APIEndpoints.ALL_SPECIALIZATION).subscribe(
      response => { if (response.status == 200 && response.message == 'Success') this.dropdownList = response.result; },
      error => { this._ns.showSnakBar(Constant.SERVER_ERROR, "") })
  }


  post(url, formData) {
    return this._http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe()
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
