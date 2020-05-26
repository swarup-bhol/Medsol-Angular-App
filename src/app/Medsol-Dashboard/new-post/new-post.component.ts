import { Component, OnInit } from '@angular/core';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  message = '';
  imageURL: string;
  fileData: File;
  userId;
  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router
  ) { }


  ngOnInit() {
    this.userId = localStorage.getItem('id');
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
    const formData = new FormData();
    if (this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    formData.append('content', this.message);
    this._as.postRequest(APIEndpoints.UPLOAD_POST + this.userId, formData).subscribe(
      data => {if (data.status == 200) this._ns.showSnakBar(Constant.UPLOADED_SUCCESSFULLY, '');  this.imageURL = '';  this.message = ''; },
      error => {if (error.status == 401) {localStorage.removeItem('token');localStorage.removeItem('id');this._router.navigate(['/login']);this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '')} else {this._ns.showSnakBar(Constant.SERVER_ERROR, '')}});
  }

}
