import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from './../../Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {

  professions: [];
  grades: [];
  specializations: [];
  subspecializations: [];
  profileForm: FormGroup;


  fullName: string;
  email: string;
  mobile: string;
  isSubmited = false;

  constructor(
    private _fb: FormBuilder,
    private _as: APIServiceService,
    private _route: ActivatedRoute,
    private _ns: NotificationService,
    private router: Router
  ) { console.log(123) }


  ngOnInit() {

    this.fullName = this._route.snapshot.paramMap.get('name');
    this.email = this._route.snapshot.paramMap.get('email');
    this.mobile = this._route.snapshot.paramMap.get('mobile');
    this.profileForm = this._fb.group({
      name: [''],
      email: [''],
      mobile: [''],
      dob: [''],
      profession: [''],
      grade: [''],
      institute: [''],
      specialization: [''],
      subspecialization: ['']
    })
    this.setField(this.email, this.fullName, this.mobile);
    this.getAllProfession();
    this.getAllSpecialization();
  }
  setField(email: string, fullName: string, mobile: string) {
    this.profileForm.patchValue({email: email,name: fullName, mobile: mobile})
  }

  createProfile() {
    this.isSubmited = true;
    if (this.profileForm.invalid) return;
    this._as.postRequest(APIEndpoints.CREATE_PROFILE + this.email, this.profileForm.value).subscribe(
      response => { if (response.status == 200) { localStorage.setItem('token', response.result.token); localStorage.setItem('id', response.result.userId); this.router.navigate(['/']); location.reload(); } if (response.status == 409) { this._ns.showSnakBar(Constant.PROFILE_ALREADY_CREATED, '') } },
      error => { if (error.status = 404) this._ns.showSnakBar(Constant.USER_NOT_FOUND, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); })
  }

  /**
   * @author Swarup Bhol
   * @purpose Get all Professions
   * 
   * @param 
   * 
   * @returns void
   */
  getAllProfession() {
    this._as.getRequest(APIEndpoints.ALL_PROFESSION).subscribe(
      response => {if (response.status == 200 && response.message == 'Success')this.professions = response.result;},
      error => {this._ns.showSnakBar(Constant.SERVER_ERROR, "")});
  }


  /**
   * @author Swarup
   * @purpose getGrades in terms of profession
   * 
   * @param profId
   * 
   * @returns void
   */
  onProffessionChange(profId) {
    this._as.getRequest(APIEndpoints.GRADE_BY_PROFESSION + profId).subscribe(
      response => {if (response.status == 200 && response.message == 'Success') this.grades = response.result;},
      error => {this._ns.showSnakBar(Constant.SERVER_ERROR, "")})
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
      response => {if (response.status == 200 && response.message == 'Success') this.specializations = response.result;},
      error => {this._ns.showSnakBar(Constant.SERVER_ERROR, "")})
  }

  /**
   * @author Swarup Bhol
   * 
   * @purpose get all sub-specialization on the basis of specialization
   * @param specId 
   * 
   * @returns void
   */
  onSpecSelected(specId) {
    this._as.getRequest(APIEndpoints.SUB_SPEC_BY_SPEC + specId).subscribe(
      response => {if (response.status == 200 && response.message == 'Success')this.subspecializations = response.result;},
      error => {this._ns.showSnakBar(Constant.SERVER_ERROR, "")})
  }

}
