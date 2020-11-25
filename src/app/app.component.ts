import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { APIServiceService } from './Medsol-Services/apiservice.service';
import { NotificationService } from './Medsol-Services/Common/notification.service';
import { APIEndpoints } from './Constants/APIEndpoints';
import { Constant } from './Constants/Constant';
import { Router } from '@angular/router';
import { LoaderService } from './Medsol-Services/Common/loader.service';
import { interval, Subscription } from 'rxjs';
import { WebsocketService } from './Medsol-Services/Websocket/websocket.service';
import { LogoutService } from './Medsol-Services/Common/logout.service';
import { SharedVarService } from './Medsol-Services/Common/shared-var.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , AfterViewInit{
  subscription: Subscription;
  userId = null;
  search = "";
  title = 'Medsol';
  profile: any;
  searchText = '';
  stompClient;
  isSerched: boolean;
  loader: any;
  notifications: any[any];
  notificationCount = 0;
  pageNo = 0;
  // server = require('http').Server();

  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router,
    private _ls: LoaderService,
    private webSocketService: WebsocketService,
    private _logoutService: LogoutService,
    private _chan: ChangeDetectorRef,
    private _bs: SharedVarService
  ) { console.log("websocket") }


  ngAfterViewInit() {
    this._chan.detectChanges();
    this.userId = localStorage.getItem('id');
  }

  ngOnInit(): void {
    this._bs.userIdExist.next(localStorage.getItem('id'));
    this._ls.loader.subscribe(data => { this.loader = data })
    const text = 'Your Text Here';
    this._bs.userIdExist.subscribe(result => this.userId = result);//localStorage.getItem('id');
    if (this.userId != null) {
      this.stompClient = this.webSocketService.connect();
      this.getProfileInfo();
      this.getOldNotification();
      this.stompClient.connect({}, frame => {
        this.stompClient.subscribe('/user/' + this.userId + '/reply', data => {
          this.notificationCount = JSON.parse(data.body).length;
          this.notifications = [...JSON.parse(data.body),...this.notifications];
          console.log(this.notifications);
        })

      });
    }
  }




  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(
      response => { if (response.status == 200) this.profile = response.result; },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._logoutService.logout()} else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  logout() {
    localStorage.clear();
    this._bs.userIdExist.next(null);
    this._router.navigate(['/login']);
    // location.reload();
  }

  searchItem() {
    if (this.searchText == '') this._ns.showSnakBar(Constant.INPUT_REQUIRED, '')
    this._router.navigate(['search', this.searchText]);

  }

  // getNotification() {
  //   this._as.getRequest(APIEndpoints.GET_NOTIFICATION + this.userId).subscribe(
  //     response => { if (response.status == 200) { this.newNotification = response.result; console.log(response) } },
  //     error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  // }
  getOldNotification() {
    this._as.getRequest(APIEndpoints.GET_OLD_NOTIFICATION + this.userId + "/" + this.pageNo).subscribe(
      response => { if (response.status == 200) { this.notifications = response.result; this.pageNo++;
         console.log("sadd"+response.result) } },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._logoutService.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  getMoreNotification() {
    this._as.getRequest(APIEndpoints.GET_OLD_NOTIFICATION + this.userId + "/" + this.pageNo).subscribe(
      response => { if (response.status == 200) { this.notifications.unshift(response.result); console.log(response); this.pageNo++ } },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._logoutService.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
}
