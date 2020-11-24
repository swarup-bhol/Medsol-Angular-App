import { Component, OnInit } from '@angular/core';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { Constant } from 'src/app/Constants/Constant';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LogoutService } from 'src/app/Medsol-Services/Common/logout.service';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.css']
})
export class SearchPeopleComponent implements OnInit {
  peopleList: [];
  userId: string;
  profile: any;
  searcItem;
  peoples: any;

  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _ls: LogoutService
  ) { }

  ngOnInit() {
    console.log(1)
    this.userId = localStorage.getItem('id');
    this.searcItem = this._route.params.subscribe(params => {
      const term = params['query'];
      this.findPeople(term);
    });
    this.getProfileInfo();
    this.getSuggetions();
    ;
  }

  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(response => { if (response.status == 200) this.profile = response.result; },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') })
  }

  getSuggetions() {
    this._as.getRequest(APIEndpoints.SUGGETIONS + this.userId + '/peoples/0/6').subscribe(
      response => { if (response.status == 200) this.peopleList = response.result; },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  followUser(followingUser, people) {
    const url = APIEndpoints.FOLLOW + followingUser + "/follow/" + this.userId;
    this._as.postRequest(url, "").subscribe(
      data => { if (data.status == 200) people.following = data.result.following },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }
  
  unFollowUser(followingUserId, people) {
    const url = APIEndpoints.FOLLOW + followingUserId + "/unFollow/" + this.userId;
    this._as.putRequest(url, null).subscribe(
      data => { people.following = data.result.following; },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  findPeople(searcItem) {
    this._as.getRequest(APIEndpoints.SEARCH_USER+this.userId+'/'+searcItem).subscribe(
      response=>{if(response.status == 200)this.peoples = response.result; },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
}
