import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { Router } from '@angular/router';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { LoaderService } from 'src/app/Medsol-Services/Common/loader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  passwordForm: FormGroup;
  emailForm: FormGroup
  codeForm: FormGroup
  emailAddress: string;
  email = true;
  verify = false;
  resetpass = false;
  emailSubmitted = false;
  codeSubmitted = false;
  passwordSubmitted = false;
  errorMessage = "Hello"
  errorMsg = false;
  successMsg = false;
  user: any;
  userId: any;

  constructor(
    private _fb: FormBuilder,
    private _as: APIServiceService,
    private _router: Router,
    private _ns: NotificationService,
    private _ls: LoaderService
  ) { }

  ngOnInit() {
    this.passwordForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      cnfPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
    this.emailForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
    this.codeForm = this._fb.group({
      code: ['', [Validators.required]]
    })
    console.log(1)
  }
  sentEmail() {
    this.emailSubmitted = true;
    if (this.emailForm.invalid) return;
    this._ls.loader.next(true);
    this.emailAddress = this.emailForm.value.email;
    this._as.getRequest(APIEndpoints.SENT_MAIL + this.emailForm.value.email).subscribe(
      response => {
        if (response.status == 200 && response.result == "User Not Found") { this.errorMsg = true; this.errorMessage = response.result; }
        else if (response.status == 200 && response.result == true) { this.email = false; this.verify = true; this.errorMsg = false; this.successMsg = true; this.errorMessage = "Email Sent successfully" }
        else { this.errorMessage = 'Some Error Occur'; this.errorMsg = true; this.successMsg = false; }
        this._ls.loader.next(false);

      },
      error => { this.errorMessage = 'Some Error Occur'; this.errorMsg = true; this.successMsg = false; this._ls.loader.next(false)}
    )
  }


  verifyCode() {

    this.codeSubmitted = true;
    if (this.codeForm.invalid) return;
    this._ls.loader.next(true);
    this._as.getRequest(APIEndpoints.VERIFY_CODE + this.emailAddress + "/" + this.codeForm.value.code).subscribe(
      response => {
        if (response.status == 200 && response.message == "Bad request") { this.errorMsg = true; this.errorMessage = 'Invalid Code'; this.errorMsg = true; this.successMsg = false;}
        else if (response.status == 200 && response.message == 'Success') { this.errorMessage = 'Code Verified'; this.email = false; this.verify = false; this.resetpass = true; this.userId = response.result.userId; this.errorMsg = false; this.successMsg = true;}
        else { this.errorMessage = 'Some error occured'; this.errorMsg = true; this.successMsg = false; }
        this._ls.loader.next(false);
      },
      error => { this.errorMessage = Constant.SERVER_ERROR; this.errorMsg = true; this.successMsg = false;this._ls.loader.next(false); })
  }
  updatePassword() {
    this.passwordSubmitted = true;
    if (this.passwordForm.invalid) return;
    this._ls.loader.next(true);
    this._as.putRequest(APIEndpoints.CHANGE_PASSWORD + this.userId, this.passwordForm.value).subscribe(
      data => {
        if (data.status == 200) { this._ns.showSnakBar('Password Change Successfully;', ''); this._router.navigate(['/login']) }
        if (data.status == 402) this._ns.showSnakBar('password not matching', '');
        this._ls.loader.next(false);
      },
      error => { this._ns.showSnakBar('Internal Server Error', ''); this._ls.loader.next(false);this._router.navigate(['/login']) });
  }


  checkPasswords(changePasswordForm: FormGroup) {
    let pass = changePasswordForm.get('password').value;
    let confirmPass = changePasswordForm.get('cnfPassword').value;
    return pass === confirmPass ? true : false;
  }
  get p() { return this.passwordForm.controls; }
  get c() { return this.codeForm.controls; }
  get e() { return this.emailForm.controls; }

}
