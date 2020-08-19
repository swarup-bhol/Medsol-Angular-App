import { Component, OnInit } from '@angular/core';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { Router } from '@angular/router';
import { DashBoardComponent } from '../dash-board/dash-board.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  
  dasboard:DashBoardComponent
  message = '';
  imageURL: string;
  fileData: File;
  userId;
  progressInfos = 0;
  specializations: any;
  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router
  ) { }


  ngOnInit() {
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
    this._as.getRequest(APIEndpoints.SPECIALIZATION_BY_USER+this.userId).subscribe(
      response => {if (response.status == 200 && response.message == 'Success') this.selectedItems = response.result; },
      error => {this._ns.showSnakBar(Constant.SERVER_ERROR, "")})
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
    if(this.message == '' ){
      this._ns.showSnakBar('Please add description','');
      return;
    } if(this.selectedItems.length == 0){
      this._ns.showSnakBar('Please add Post Type','');
      return;
    }
    const formData = new FormData();
    if (this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    formData.append('content', this.message);
    formData.append('type',JSON.stringify(this.selectedItems));
    console.log(formData)
    this._as.postRequest(APIEndpoints.UPLOAD_POST + this.userId, formData).subscribe(
    
      data => {
        if (data.status == 200) {
        this._ns.showSnakBar(Constant.UPLOADED_SUCCESSFULLY, ''); 
      } this.imageURL = '';  this.message = ''; this.dasboard.getSuggetions(); },
      error => {if (error.status == 401) {localStorage.removeItem('token');localStorage.removeItem('id');this._router.navigate(['/login']);this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '')} else {this._ns.showSnakBar(Constant.SERVER_ERROR, '')}});
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
      response => {if (response.status == 200 && response.message == 'Success') this.dropdownList = response.result; },
      error => {this._ns.showSnakBar(Constant.SERVER_ERROR, "")})
  }
}
