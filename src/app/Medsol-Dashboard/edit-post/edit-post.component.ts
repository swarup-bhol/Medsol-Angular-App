import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  message = '';
  imageURL: string;
  fileData: File;
  userId;
  constructor(
    public dialogRef: MatDialogRef<EditPostComponent>, @Inject(MAT_DIALOG_DATA) public post: any,
    private _as:APIServiceService ,
    private _ns:NotificationService
     ) {
  }

  ngOnInit() {
    this.message = this.post.post.postContent;
    if (this.post.post.postImgPath != null)
      this.imageURL = 'http://localhost:8080/api/medsol/posts/img/' + this.post.post.postId;
  }
  onFileChanged(event) {
    const reader = new FileReader();
    this.fileData = <File>event.target.files[0];
    reader.readAsDataURL(this.fileData);
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
  }
  deleteImage(){
    this.imageURL = '';
  }
  closeDialog(){
    this.dialogRef.close();
  }
  updatePost() {
    const formData = new FormData();
    if (this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    formData.append('content', this.message);
    this._as.putRequest(APIEndpoints.UPDATE_POST + this.post.post.postId, formData).subscribe(
      data => {if (data.status == 200) this._ns.showSnakBar(Constant.UPLOADED_SUCCESSFULLY, '');  this.imageURL = '';  this.message = '';this.dialogRef.close();location.reload() },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });

  }
}
