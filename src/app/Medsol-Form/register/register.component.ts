import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIServiceService } from './../../Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  invalid = false;
  signupForm: FormGroup;
  isSubmited = false;
  errorMessage = '';

  constructor(
    private _fb: FormBuilder,
    private _as: APIServiceService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.signupForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    });
  }

  createUser() {
    this.isSubmited = true;
    if (!this.signupForm.valid) return;
    this._as.postRequest(APIEndpoints.REGISTER_USER, this.signupForm.value).subscribe(
      response => {
        if (response.status == 200 && response.message == 'User Created Successfully') {
        this.invalid = false; this._router.navigate(['/profile-info',response.result.userId, response.result.fullName, response.result.userMobile, response.result.userEmail]);
        } else if (response.status == 409) {
        this.errorMessage = 'User Already Exist'; this.invalid = true;
        } else { this.errorMessage = 'Some Error Happens'; this.invalid = true; }
      },
      error => { this.errorMessage = 'Internal Server Error'; this.invalid = true; });
  }

  get f() { return this.signupForm.controls; }
}
