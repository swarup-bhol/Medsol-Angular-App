import { Component, OnInit } from '@angular/core';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
  peopleList: any[any];
  userId;
  profile: any;

  peoples: any;
  pageNo = 0;
  followerList: any;
  type;

  constructor(
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {  }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    // this.type = this._route.snapshot.paramMap.get('type');
    this._route.params.subscribe(params => {
      const term = params['type'];
      if (term == 'suggetions') {
        this.getSuggetions(this.pageNo);
      } else if (term == 'followings') {
        this.getAllFollowerList();
      } else if (term == 'follower') {
        this.getAllFollowingList();
      } else { this._router.navigate(['/404']); }
    });
  }

  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(
      response => { if (response.status == 200) this.profile = response.result; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') })
  }

  getSuggetions(pageNo) {
    this._as.getRequest(APIEndpoints.SUGGETIONS + this.userId + '/peoples/' + pageNo + '/6').subscribe(
      response => { if (response.status == 200) this.peopleList = response.result; console.log(response.result) },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  getAllFollowerList() {
    this._as.getRequest(APIEndpoints.GET_ALL_FOLLOWER + this.userId).subscribe(
      response => { if (response.status == 200) this.peopleList = response.result; console.log(response.result) },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  getAllFollowingList() {
    this._as.getRequest(APIEndpoints.GET_ALl_FOLLOWING + this.userId).subscribe(
      response => { if (response.status == 200) this.peopleList = response.result; console.log(response.result) },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  followUser(followingUser, people) {
    this._as.postRequest(APIEndpoints.FOLLOW + followingUser + "/follow/" + this.userId, "").subscribe(
      data => { if (data.status == 200) people.following = data.result.following },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  unFollowUser(followingUserId, people) {
    this._as.putRequest(APIEndpoints.FOLLOW + followingUserId + "/unFollow/" + this.userId, null).subscribe(
      data => { people.following = data.result.following; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  onScroll(){
    this.pageNo++;
    this._as.getRequest(APIEndpoints.SUGGETIONS + this.userId + '/peoples/' + this.pageNo + '/6').subscribe(
      response => { if (response.status == 200) this.peopleList = this.peopleList.concat(response.result); console.log(response.result) },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
}
