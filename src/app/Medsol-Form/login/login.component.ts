import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIServiceService } from './../../Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { Router } from '@angular/router';
// import { APIEndpoints } from 'src/app/Constants/APIEndpoints';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage = '';
  invalid = false;
  loginForm: FormGroup;
  isSubmited = false;


  constructor(
    private _fb: FormBuilder,
    private _as: APIServiceService,
    private _route:Router
  ) { }



  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * @author Swarup Bhol
   * 
   * @purpose login a user
   * 
   * @returns void
   */
  loginUser() {
    this.isSubmited = true;
    if (this.loginForm.invalid)
      return;
    this._as.postRequest(APIEndpoints.LOGIN_USER, this.loginForm.value).subscribe(
      response => {if(response.status == 200 && response.message == 'Success'){localStorage.setItem('token',response.result.token);localStorage.setItem('id',response.result.userId);this.invalid = false;this._route.navigate(['']); location.reload();}
                   if(response.status == 400 && response.message == 'Username or Password is Invalid'){this.errorMessage = 'Invalid Username and Password';this.invalid = true;}
                   if(response.status == 401){this.errorMessage = 'Invalid Input';this.invalid = true;}},
      error => {if(error.status == 0){this.invalid = true;this.errorMessage = 'Internal Server Error';}});
  }

  get f() { return this.loginForm.controls }


}
