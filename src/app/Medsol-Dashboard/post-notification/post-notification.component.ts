import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { Constant } from 'src/app/Constants/Constant';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from 'src/app/Medsol-Common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { LogoutService } from 'src/app/Medsol-Services/Common/logout.service';
export class Response{
  message: string
  result: Posts
  status: number
}
export class Post {
  postContent: string
  postId: number
  postImgId: number
  postImgPath: string
  postUpdatedTime: string
  postUploadTime: string
  postVideoPath: string
  recordStatus: boolean
}
export class Posts {
  commentCount: number
  commentLIst: []
  fullName: string
  instituteName: string
  like: boolean
  likeCount: number
  post: any
  postMediaId: null
  profession: "Doctor"
  userId: 147
}
@Component({
  selector: 'app-post-notification',
  templateUrl: './post-notification.component.html',
  styleUrls: ['./post-notification.component.css']
})

export class PostNotificationComponent implements OnInit {
  userId: string;
  profile: any;
  postId: string;
  post: any;
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  cmtText: string;
  repText: string;
  max= 2;
  constructor(
    private _ns: NotificationService,
    private cdRef: ChangeDetectorRef,
    private _as: APIServiceService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _http: HttpClient,
    public dialog: MatDialog,
    private _ls: LogoutService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this._route.params.subscribe(params => {
      const postId = params['id'];
      this.getPostByPostId(postId);
    });
    // this.postId = this._route.snapshot.paramMap.get('id');
    this.getProfileInfo();
    // this.getPostByPostId();
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }
  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(response => { if (response.status == 200) this.profile = response.result; console.log(response) },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()} else this._ns.showSnakBar(Constant.SERVER_ERROR, '') })
  }

  getPostByPostId(postId) {
    this._as.getRequest(APIEndpoints.GET_POST_By_ID + postId).subscribe(
      response => { 
        if (response.status == 200) this.post = response.result; console.log(response)
       },
      error => { if (error.status == 401) {  this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout() } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') })

  }

  timeDifference(date) {
    var myDate = new Date(date);
    var difference = new Date().getTime() - myDate.getTime();

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60

    var secondsDifference = Math.floor(difference / 1000);


    if (daysDifference == 0 && hoursDifference == 0 && minutesDifference == 0) {
      return secondsDifference + " sec"
    } else if (daysDifference == 0 && hoursDifference == 0 && minutesDifference != 0) {
      return minutesDifference + " min"
    } else if (daysDifference == 0 && hoursDifference != 0) {
      return hoursDifference + " hr"
    } else {
      return this.monthNames[myDate.getUTCMonth()] + " " + myDate.getDate() + " " + myDate.getFullYear();
    }
  }
  clickComment(event, postId, message, i) {
    if (event.keyCode == 13 && event.code) {
      event.preventDefault();
      if (message == '') { this._ns.showSnakBar(Constant.INPUT_REQUIRED, ''); return }
      var comment = { "userId": this.userId, "postId": postId, "message": message };
      this._as.postRequest(APIEndpoints.POST_COMMENT, comment).subscribe(
        data => {
          if (data.status == 200) {
            this.post.commentLIst.unshift(data.result);
            this.post.commentCount = this.post.commentCount + 1;
          } this.cmtText = '';
        },
        error => { this._ns.showSnakBar(Constant.SERVER_ERROR, ''); this.cmtText = ''; });
    }
  }
  replayComment(event, item, message, postIndex, commentIndex) {
    if (event.keyCode == 13 && event.code) {
      event.preventDefault();
      if (message == '') { this._ns.showSnakBar(Constant.INPUT_REQUIRED, ''); return }
      var comment = { "userId": this.userId, "commentId": item.commentId, "commentedText": message };
      this._as.postRequest(APIEndpoints.POST_RECOMMENT, comment).subscribe(
        data => {
          if (data.status == 200) {
            this.post.commentLIst[commentIndex].replays.unshift(data.result);
          }
          this.repText = '';
        },
        error => { this._ns.showSnakBar(Constant.SERVER_ERROR, ''); this.repText = ''; });
    }
  }

  clickLike(postId, i) {
    this.post.like = true;
    this.post.likeCount = this.post.likeCount + 1;
    this._as.postRequest(APIEndpoints.CLICK_LIKE + postId + '/' + this.userId, null).subscribe(
      data => { },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '') ; this._ls.logout()} else { this._ns.showSnakBar(Constant.SERVER_ERROR, '') } });
  }

  clickUnLike(postId, i) {
    this.post.like = false;
    this.post.likeCount = this.post.likeCount - 1;
    this._as.putRequest(APIEndpoints.CLICK_UN_LIKE + postId + '/' + this.userId, null).subscribe(
      data => { if (data == 200) { this.post.find(item => item.post.postId == postId).like = false; } },
      error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '');this._ls.logout()} else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }
  deleteComment(comment, commentList, i) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Ae you sure want to delete the comment ?', title: 'Delete Comment' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._as.deleteRequest(APIEndpoints.DELETE_COMMENT + comment.commentId).subscribe(
          data => {
            if (data.status == 200) {
              commentList.pop(Comment);
              this.post.commentCount = this.post.commentCount - 1;
              this._ns.showSnakBar(Constant.DELETED_SUCCESSFULLY, '')
            }
          },
          error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()} else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
      }

    });
  }
  deleteReComment(replay, replayList, j) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Ae you sure want to delete the comment ?', title: 'Delete Comment' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._as.deleteRequest(APIEndpoints.DELETE_RECOMMENT + replay.commentId).subscribe(
          data => {
            if (data.status == 200) {
              replayList.pop(replay)
              this._ns.showSnakBar(Constant.DELETED_SUCCESSFULLY, '')
            }
          },
          error => { if (error.status == 401) {this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._ls.logout()}else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
      }

    });


  }
}
