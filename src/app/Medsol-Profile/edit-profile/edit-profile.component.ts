import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { Constant } from 'src/app/Constants/Constant';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  imgurl="./../../../assets/pic.png";
  professions:[];
  grades:[];
  specializations:[];
  subspecializations:[];
  profileForm:FormGroup;
  fileData: File;
  userId;
  fullName: string;
  email: string;
  mobile: string;
  isSubmited = false;
  profile: any;

  constructor(
    private _fb: FormBuilder,
    private _as: APIServiceService,
    private _route:ActivatedRoute,
    private _ns: NotificationService,
    private _router: Router
  ) { }


  ngOnInit() {
this.userId = localStorage.getItem('id');
    this.profileForm = this._fb.group({
      name:[''],
      email:[''],
      mobile:[''],
      dob:[''],
      profession:[''],
      grade:[''],
      institute:[''],
      specialization:[''],
      subspecialization:['']
    })
    console.log(123)
    this.getProfileInfo();
  }
  setField(obj) {
    this.profileForm.patchValue({
      name:obj.fullName,
      email:obj.email,
      mobile:obj.mobile,
      dob:obj.dob,
      profession:obj.profession,
      grade:obj.grade,
      institute:obj.institute,
      specialization:obj.specialization,
      subspecialization:obj.subSpecialization
    })
  }

  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(response => { if (response.status == 200) {console.log(response.result);this.setField(response.result) }},
      error => {
        if (error.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');
          this._router.navigate(['/login']);
        } else this._ns.showSnakBar(Constant.SERVER_ERROR, '')
      })
  }
  updateProfile(){
    this.isSubmited = true;
    if(this.profileForm.invalid) return ;
    this._as.postRequest(APIEndpoints.CREATE_PROFILE+this.email,this.profileForm.value).subscribe(
      response=>{
        if(response.status == 200){
          localStorage.setItem('token', response.result.token);
          localStorage.setItem('id', response.result.userId);
          this._router.navigate(['/']);
        }if(response.status == 409){
          this._ns.showSnakBar(Constant.PROFILE_ALREADY_CREATED,'')
        }
      },
      error=>{
        if(error.status = 404){
          this._ns.showSnakBar(Constant.USER_NOT_FOUND,'')
        }else{
          this._ns.showSnakBar(Constant.SERVER_ERROR,'');
        }
      })
  }

   // Change profile picturte
   onFileChanged(event) {
    this.fileData = <File>event.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);
    this._as.postRequest(APIEndpoints.UPLOAD_PROFILE_PICTURE + this.userId, formData).subscribe(
      data => {
        if (data.status == 200) {
          this._ns.showSnakBar(Constant.UPLOADED_SUCCESSFULLY,'')
          location.reload();
        }
      },
      error => {
        if (error.status == 401) {
          this._ns.showSnakBar(Constant.TOKEN_EXPIRE,'')
          this._router.navigate(['/login']);
        }else{
          this._ns.showSnakBar(Constant.SERVER_ERROR,'')
        }
        console.log(error);
      }
    );
  }
}
