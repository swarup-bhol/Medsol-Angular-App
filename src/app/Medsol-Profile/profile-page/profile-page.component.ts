import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  peoples: [];
  posts: [any];
  userId: any;
  profile: any;
  currentUser;
  cmtText='';
  following: any;

  constructor(
    private _route: ActivatedRoute,
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get("id");
    this.currentUser = localStorage.getItem('id');
    this.isFollowing(this.userId,this.currentUser);
    this.getSuggetions();
    this.getProfileInfo();
    this.getUploadedPosts();
  }

  getSuggetions() {
    this._as.getRequest(APIEndpoints.SUGGETIONS + this.userId + '/peoples/0/6').subscribe(
      response => { if (response.status == 200) this.peoples = response.result; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(
      response => { if (response.status == 200) this.profile = response.result;  console.log(response)},
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  getUploadedPosts() {
    this._as.getRequest(APIEndpoints.GET_UPLOAD_POST + this.userId + "/post/0").subscribe(
      data => { if (data.status == 200) { this.posts = data.result; } console.log(data) },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  followUser(followingUser, people) {
    const url = APIEndpoints.FOLLOW + followingUser + "/follow/" + this.userId;
    this._as.postRequest(url, "").subscribe(
      data => { if (data.status == 200) people.following = data.result.following },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }
  
  unFollowUser(followingUserId, people) {
    const url = APIEndpoints.FOLLOW + followingUserId + "/unFollow/" + this.userId;
    this._as.putRequest(url, null).subscribe(
      data => { people.following = data.result.following; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  
  clickComment(event, postId, message, i) {
    if (event.keyCode == 13 && event.code) {
      event.preventDefault();
      if (message == '') { this._ns.showSnakBar(Constant.INPUT_REQUIRED, ''); return }
      var comment = { "userId": this.userId, "postId": postId, "message": message };
      this._as.postRequest(APIEndpoints.POST_COMMENT, comment).subscribe(
        data => { if (data.status == 200) { this.posts[i].commentLIst.unshift(data.result); this.posts[i].commentCount = this.posts[i].commentCount + 1; } this.cmtText = ''; },
        error => { this._ns.showSnakBar(Constant.SERVER_ERROR, ''); this.cmtText = ''; });
    }
  }

  clickLike(postId, i) {
    this.posts[i].like = true;
    this.posts[i].likeCount = this.posts[i].likeCount + 1;
    this._as.postRequest(APIEndpoints.CLICK_LIKE + postId + '/' + this.userId, null).subscribe(
      data => { },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '') } else { this._ns.showSnakBar(Constant.SERVER_ERROR, '') } });
  }

  clickUnLike(postId, i) {
    this.posts[i].like = false;
    this.posts[i].likeCount = this.posts[i].likeCount - 1;
    this._as.putRequest(APIEndpoints.CLICK_UN_LIKE + postId + '/' + this.userId, null).subscribe(
      data => { if (data == 200) { this.posts.find(item => item.post.postId == postId).like = false; } },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  isFollowing(userId: string, currentUser: string) {
    this._as.getRequest(APIEndpoints.END_POINT + "user/" + currentUser + "/isFollow/" + userId).subscribe(
      data => {if (data.status == 200) this.following = data.result;},
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

}
