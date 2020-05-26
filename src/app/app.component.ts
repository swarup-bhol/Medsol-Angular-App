import { Component, OnInit } from '@angular/core';
import { APIServiceService } from './Medsol-Services/apiservice.service';
import { NotificationService } from './Medsol-Services/Common/notification.service';
import { APIEndpoints } from './Constants/APIEndpoints';
import { Constant } from './Constants/Constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  userId;
  search = "";
  title = 'Medsol';
  profile: any;
  searchText = '';

  isSerched: boolean;

  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    if (this.userId != null)
      this.getProfileInfo();
    console.log(this.userId)
  }

  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(
      response => { if (response.status == 200) this.profile = response.result; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  logout() {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  searchItem() {
    if (this.searchText == '') this._ns.showSnakBar(Constant.INPUT_REQUIRED, '')
    this._router.navigate(['search',this.searchText]);
    location.reload();
  }
}
