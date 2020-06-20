import { Component, OnInit } from '@angular/core';
import { APIServiceService } from './Medsol-Services/apiservice.service';
import { NotificationService } from './Medsol-Services/Common/notification.service';
import { APIEndpoints } from './Constants/APIEndpoints';
import { Constant } from './Constants/Constant';
import { Router } from '@angular/router';
import { LoaderService } from './Medsol-Services/Common/loader.service';
import { error } from 'protractor';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  subscription: Subscription;
  userId;
  search = "";
  title = 'Medsol';
  profile: any;
  searchText = '';

  isSerched: boolean;
  loader: any;
  notification: any[any];
  newNotification = [];
  pageNo = 0;

  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router,
    private _ls: LoaderService
  ) { }

  ngOnInit(): void {
    this._ls.loader.subscribe(data => { this.loader = data })
    const source = interval(10000 * 60 * 60);
    const text = 'Your Text Here';
    this.userId = localStorage.getItem('id');
    if (this.userId != null) {
      this.getProfileInfo();
      this.getOldNotification();
      this.subscription = source.subscribe(val => this.getNotification());
    }


   
   
  }




  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(
      response => { if (response.status == 200) this.profile = response.result; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  logout() {
    localStorage.clear();
    this._router.navigate(['/login']);
    location.reload();
  }

  searchItem() {
    if (this.searchText == '') this._ns.showSnakBar(Constant.INPUT_REQUIRED, '')
    this._router.navigate(['search', this.searchText]);

  }

  getNotification() {
    this._as.getRequest(APIEndpoints.GET_NOTIFICATION + this.userId).subscribe(
      response => { if (response.status == 200) { this.newNotification = response.result; console.log(response) } },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  getOldNotification() {
    this._as.getRequest(APIEndpoints.GET_OLD_NOTIFICATION + this.userId + "/" + this.pageNo).subscribe(
      response => { if (response.status == 200) { this.notification = response.result; console.log(response); this.pageNo++ } },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  getMoreNotification() {
    this._as.getRequest(APIEndpoints.GET_OLD_NOTIFICATION + this.userId + "/" + this.pageNo).subscribe(
      response => { if (response.status == 200) { this.notification.unshift(response.result); console.log(response); this.pageNo++ } },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
}
