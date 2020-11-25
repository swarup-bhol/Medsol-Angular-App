import { Component, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { ConfirmDialogComponent } from 'src/app/Medsol-Common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { EditPostComponent } from 'src/app/Medsol-Dashboard/edit-post/edit-post.component';
import * as $ from 'jquery';
import 'is-in-viewport';
import { LogoutService } from 'src/app/Medsol-Services/Common/logout.service';
import { SharedVarService } from 'src/app/Medsol-Services/Common/shared-var.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  peoples: [];
  posts: any[any];
  userId: any;
  profile: any;
  currentUser;
  cmtText = '';
  following: any;
  isEditPost: boolean = false;
  isEditComment: boolean;
  max = 3;
  postId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _router: Router,
    private _renderer: Renderer2,
    public dialog: MatDialog,
    private _ls: LogoutService,
    private _bs: SharedVarService
  ) { }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get("id");
    this.currentUser = localStorage.getItem('id');
    this._bs.uploadPost.subscribe(data=>{
      if(data != null){
        console.log("check")
        this.posts = [...data.result,...this.posts];

      }
    });
    this.isFollowing(this.userId, this.currentUser);
    this.getSuggetions();
    this.getProfileInfo();
    this.getUploadedPosts();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    window.addEventListener('scroll', this.checkScroll, false);
    window.addEventListener('resize', this.checkScroll, false);
  }
  getSuggetions() {
    this._as.getRequest(APIEndpoints.SUGGETIONS + this.userId + '/peoples/0/6').subscribe(
      response => { if (response.status == 200) this.peoples = response.result; },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(
      response => { if (response.status == 200) this.profile = response.result; console.log(response) },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  getUploadedPosts() {
    this._as.getRequest(APIEndpoints.GET_UPLOAD_POST + this.userId + "/post/0").subscribe(
      data => { if (data.status == 200) { this.posts = data.result; } console.log(data) },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  followUser(followingUser, people) {
    const url = APIEndpoints.FOLLOW + followingUser + "/follow/" + this.userId;
    this._as.postRequest(url, "").subscribe(
      data => { if (data.status == 200) people.following = data.result.following },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  unFollowUser(followingUserId, people) {
    const url = APIEndpoints.FOLLOW + followingUserId + "/unFollow/" + this.userId;
    this._as.putRequest(url, null).subscribe(
      data => { people.following = data.result.following; },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
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
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout() } else { this._ns.showSnakBar(Constant.SERVER_ERROR, '') } });
  }

  clickUnLike(postId, i) {
    this.posts[i].like = false;
    this.posts[i].likeCount = this.posts[i].likeCount - 1;
    this._as.putRequest(APIEndpoints.CLICK_UN_LIKE + postId + '/' + this.userId, null).subscribe(
      data => { if (data == 200) { this.posts.find(item => item.post.postId == postId).like = false; } },
      error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()}else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }
  clickCommentLike(postIndex, commentIndex, replayCommentIndex, commentId, type) {
    if (type == 'comment') {
      this.posts[postIndex].commentLIst[commentIndex].like = true;
      this.posts[postIndex].commentLIst[commentIndex].likeCount += 1;
    }
    if (type == 'replay') {
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].like = true;
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].likeCount += 1;
    }
    console.log(commentId)
    this._as.postRequest(APIEndpoints.COMMENT_LIKE + commentId + "/" + this.userId, null).subscribe(
      data => { if (data == 200) { } },
      error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()} else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }
  clickCommentUnLike(postIndex, commentIndex, replayCommentIndex, commentId, type) {
    if (type == 'comment') {
      this.posts[postIndex].commentLIst[commentIndex].like = false;
      this.posts[postIndex].commentLIst[commentIndex].likeCount -= 1;
    }
    if (type == 'replay') {
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].like = false;
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].likeCount -= 1;
    }
    this._as.putRequest(APIEndpoints.COMMENT_UNLIKE + commentId + "/" + this.userId, null).subscribe(
      data => { if (data == 200) { } },
      error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()}else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  isFollowing(userId: string, currentUser: string) {
    this._as.getRequest(APIEndpoints.END_POINT + "/user/" + currentUser + "/isFollow/" + userId).subscribe(
      data => { if (data.status == 200) this.following = data.result; },
      error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()}else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }


  deletePost(postList ,post, i) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '250px', data: { message: 'Ae you sure want to delete  ?', title: 'Delete Post' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._as.deleteRequest(APIEndpoints.DELETE_POST + post.postId).subscribe(
          data => { if (data.status == 200) { 
            postList.splice(i);
             this._ns.showSnakBar(Constant.DELETED_SUCCESSFULLY, ''); } },
          error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()}else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
      }

    });
  }
  editPost(post) {
    const dialogRef = this.dialog.open(EditPostComponent, { width: '650px', height: 'auto', maxHeight: '400px', data: post });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }

    });
  }
  deleteComment(comment, commentList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Ae you sure want to delete the comment ?', title: 'Delete Comment' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._as.deleteRequest(APIEndpoints.DELETE_COMMENT + comment.commentId).subscribe(
          data => { if (data.status == 200) { commentList.pop(Comment); this._ns.showSnakBar(Constant.DELETED_SUCCESSFULLY, '') } },
          error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()} else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
      }

    });
  }

  vid = document.getElementsByTagName('video');

 // play the perticular video that visible to scrol position
  checkScroll() {
    $('video').each(function(){
      if ($(this).is(":in-viewport")) {
          $(this)[0].play();
      } else {
          $(this)[0].pause();
      }
  })
}
}
