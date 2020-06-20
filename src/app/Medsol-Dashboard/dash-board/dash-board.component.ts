import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { ProfileService } from 'src/app/Medsol-Services/Common/profile.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/Medsol-Common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, AfterViewChecked {
  peopleList: [];
  posts: any[any];
  userId: string;
  profile: any;
  cmtText = '';
  repText = '';
  pageNo = 0;
  max = 3;
  reMax = 0;
  imgUrl = './../../../assets/pic.png';
   monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  constructor(
    private cdRef: ChangeDetectorRef,
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _ps: ProfileService,
    private _router: Router,
    public dialog: MatDialog
  ) { }


  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.getFeeds();
    this.getProfileInfo();
    this.getSuggetions();
    console.log(new Date().getMonth +" "+ new Date().getDate +" "+ new Date().getFullYear)
  }

  clickComment(event, postId, message, i) {
    if (event.keyCode == 13 && event.code) {
      event.preventDefault();
      if (message == '') { this._ns.showSnakBar(Constant.INPUT_REQUIRED, ''); return }
      var comment = { "userId": this.userId, "postId": postId, "message": message };
      this._as.postRequest(APIEndpoints.POST_COMMENT, comment).subscribe(
        data => {
          if (data.status == 200) {
            this.posts[i].commentLIst.unshift(data.result);
            this.posts[i].commentCount = this.posts[i].commentCount + 1;
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
            this.posts[postIndex].commentLIst[commentIndex].replays.unshift(data.result);
          }
          this.repText = '';
        },
        error => { this._ns.showSnakBar(Constant.SERVER_ERROR, ''); this.repText = ''; });
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

  clickCommentLike(postIndex,commentIndex,replayCommentIndex,commentId,type){
    if(type == 'comment'){
      this.posts[postIndex].commentLIst[commentIndex].like = true;
      this.posts[postIndex].commentLIst[commentIndex].likeCount += 1;
    }
    if(type == 'replay'){
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].like = true;
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].likeCount += 1;
    }
    console.log(commentId)
    this._as.postRequest(APIEndpoints.COMMENT_LIKE+commentId+"/"+this.userId,null).subscribe(
      data => { if (data == 200) { } },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }
  clickCommentUnLike(postIndex,commentIndex,replayCommentIndex,commentId,type){
    if(type == 'comment'){
      this.posts[postIndex].commentLIst[commentIndex].like = false;
      this.posts[postIndex].commentLIst[commentIndex].likeCount -= 1;
    }
    if(type == 'replay'){
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].like = false;
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].likeCount -= 1;
    }
    this._as.putRequest(APIEndpoints.COMMENT_UNLIKE+commentId+"/"+this.userId,null).subscribe(
      data => { if (data == 200) { } },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  getFeeds() {
    this._as.getRequest(APIEndpoints.UPLOAD_POST + this.userId + '/feeds/0').subscribe(
      data => { if (data.status == 200) this.posts = data.result; console.log(data) },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(response => { if (response.status == 200) this.profile = response.result; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') })
  }

  getSuggetions() {
    this._as.getRequest(APIEndpoints.SUGGETIONS + this.userId + '/peoples/0/6').subscribe(
      response => { if (response.status == 200) this.peopleList = response.result; },
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

  onScroll() {
    this.cmtText = '';
    this.pageNo++;
    this._as.getRequest(APIEndpoints.UPLOAD_POST + this.userId + '/feeds/' + this.pageNo).subscribe(
      data => { if (data.status == 200) this.posts = this.posts.concat(data.result); console.log(data.result) },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });

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
              this.posts[i].commentCount = this.posts[i].commentCount - 1;
              this._ns.showSnakBar(Constant.DELETED_SUCCESSFULLY, '')
            }
          },
          error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
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
          error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
      }

    });


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
      return this.monthNames[myDate.getUTCMonth()] +" "+ myDate.getDate() +" "+ myDate.getFullYear();
    }
  }
}
