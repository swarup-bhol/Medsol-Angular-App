import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewChild, ElementRef, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { APIServiceService } from 'src/app/Medsol-Services/apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';
import { NotificationService } from 'src/app/Medsol-Services/Common/notification.service';
import { Constant } from 'src/app/Constants/Constant';
import { ProfileService } from 'src/app/Medsol-Services/Common/profile.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/Medsol-Common/confirm-dialog/confirm-dialog.component';
import { MatVideoComponent } from 'mat-video/lib/video.component';
import * as $ from 'jquery';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import 'is-in-viewport';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, AfterViewChecked {
  @ViewChild('video', { static: false }) matVideo: MatVideoComponent;
  video: HTMLVideoElement;
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
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  form: FormGroup;


  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private _as: APIServiceService,
    private _ns: NotificationService,
    private _ps: ProfileService,
    private _router: Router,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
  }


  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;
  @ViewChild("checkBox", { static: false }) checkBox: ElementRef;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    window.addEventListener('scroll', this.checkScroll, false);
    window.addEventListener('resize', this.checkScroll, false);
  }

  ngOnInit() {

    this.userId = localStorage.getItem('id');
    this.getFeeds();
    this.getProfileInfo();
    this.getSuggetions();
    this.getAllSpecialization();
    this.getUserSpecialization();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'specializationId',
      textField: 'specializationName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // this.video = this.matVideo.getVideoTag();

  }
  /**
   * @author swarup
   * @param e 
   */
  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.value == 'on') {
      this.checkboxes.forEach((element) => {
        element.nativeElement.checked = false;
      });
      checkArray.clear();
      this.getFeeds();
      return;
    } else {
      this.checkBox.nativeElement.checked = false;
    }
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
      this._as.getRequest(APIEndpoints.POST_LIST_BY_TYPE + this.userId + '/bySpec/0?specList='+checkArray.value.toString()).subscribe(
        data => { 
          if (data.status == 200) this.posts = data.result; },
        error => { 
          if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  /**
   * @author Swarup
   * 
   * @param event 
   * @param postId 
   * @param message 
   * @param i 
   */
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
  /**
   * @author swarup
   * 
   * @param event 
   * @param item 
   * @param message 
   * @param postIndex 
   * @param commentIndex 
   */
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

  /**
   * @author swarup
   * 
   * @param postId 
   * @param i 
   * 
   * @returns 
   */
  clickLike(postId, i) {
    this.posts[i].like = true;
    this.posts[i].likeCount = this.posts[i].likeCount + 1;
    this._as.postRequest(APIEndpoints.CLICK_LIKE + postId + '/' + this.userId, null).subscribe(
      data => { },
      error => { if (error.status == 401) { this._ns.showSnakBar(Constant.TOKEN_EXPIRE, '') } else { this._ns.showSnakBar(Constant.SERVER_ERROR, '') } });
  }

  /**
   * @author Swarup
   * 
   * @param postId 
   * @param i 
   * 
   * @returns object
   */
  clickUnLike(postId, i) {
    this.posts[i].like = false;
    this.posts[i].likeCount = this.posts[i].likeCount - 1;
    this._as.putRequest(APIEndpoints.CLICK_UN_LIKE + postId + '/' + this.userId, null).subscribe(
      data => { if (data == 200) { this.posts.find(item => item.post.postId == postId).like = false; } },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  /**
   * @author swarup
   * 
   * @param postIndex 
   * @param commentIndex 
   * @param replayCommentIndex 
   * @param commentId 
   * @param type 
   * 
   * @return object
   */
  clickCommentLike(postIndex, commentIndex, replayCommentIndex, commentId, type) {
    if (type == 'comment') {
      this.posts[postIndex].commentLIst[commentIndex].like = true;
      this.posts[postIndex].commentLIst[commentIndex].likeCount += 1;
    }
    if (type == 'replay') {
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].like = true;
      this.posts[postIndex].commentLIst[commentIndex].replays[replayCommentIndex].likeCount += 1;
    }
    this._as.postRequest(APIEndpoints.COMMENT_LIKE + commentId + "/" + this.userId, null).subscribe(
      data => { if (data == 200) { } },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }
  /**
   * @author swarup
   * 
   * @param postIndex 
   * @param commentIndex 
   * @param replayCommentIndex 
   * @param commentId 
   * @param type 
   * 
   * @retuen object
   */
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
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  /**
   * 
   * @author swarup
   * 
   * @return post lists for all type
   */
  getFeeds() {
    this._as.getRequest(APIEndpoints.UPLOAD_POST + this.userId + '/feeds/0').subscribe(
      data => { if (data.status == 200) this.posts = data.result; },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  /**
   * @author swarup
   * 
   * @return return profile details object
   */
  getProfileInfo() {
    this._as.getRequest(APIEndpoints.PROFILE + this.userId).subscribe(response => { if (response.status == 200) this.profile = response.result; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') })
  }

  /**
   * @author swarup
   * 
   * @return suggetsted people list object
   */
  getSuggetions() {
    this._as.getRequest(APIEndpoints.SUGGETIONS + this.userId + '/peoples/0/6').subscribe(
      response => { if (response.status == 200) this.peopleList = response.result; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  /**
   * @author swarup
   * 
   * 
   * @param followingUser 
   * @param people 
   * 
   * @return object
   */
  followUser(followingUser, people) {
    const url = APIEndpoints.FOLLOW + followingUser + "/follow/" + this.userId;
    this._as.postRequest(url, "").subscribe(
      data => { if (data.status == 200) people.following = data.result.following },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, '') });
  }

  /**
   * @author swarup
   * 
   * @param followingUserId 
   * @param people 
   * 
   * @return object
   */
  unFollowUser(followingUserId, people) {
    const url = APIEndpoints.FOLLOW + followingUserId + "/unFollow/" + this.userId;
    this._as.putRequest(url, null).subscribe(
      data => { people.following = data.result.following; },
      error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }

  /**
   * @author swarup
   * 
   * @purpose call when page scroll to end
   */
  onScroll() {
    this.cmtText = '';
    this.pageNo++;
    if (this.form.get('checkArray').value.length == 0) {
      this._as.getRequest(APIEndpoints.UPLOAD_POST + this.userId + '/feeds/' + this.pageNo).subscribe(
        data => { if (data.status == 200) this.posts = this.posts.concat(data.result);  },
        error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
    } else {
      this._as.getRequest(APIEndpoints.POST_LIST_BY_TYPE + this.userId + '/bySpec/'+ this.pageNo +'?specList='+ this.form.get('checkArray').value.toString()).subscribe(
        data => { if (data.status == 200) this.posts = this.posts.concat(data.result);  },
        error => { if (error.status == 401) { localStorage.removeItem('token'); localStorage.removeItem('id'); this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); this._router.navigate(['/login']); } else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
     
      // console.log(this.form.get('checkArray').value.toString())
    }
  }/**
   * @author swarup

   * @param typeIdlist 
   */
  getFeedsByType(typeIdlist: string) {
    this._as.getRequest(APIEndpoints.POST_LIST_BY_TYPE + this.userId + '/bySpec/0?specList='+typeIdlist).subscribe(
      data => { if (data.status == 200) this.posts = data.result; },
      error => { if (error.status == 401) this._ns.showSnakBar(Constant.TOKEN_EXPIRE, ''); else this._ns.showSnakBar(Constant.SERVER_ERROR, ''); });
  }
  /**
   * @author swarup
   * 
   * @purpose delete comment
   * 
   * @param comment 
   * @param commentList 
   * @param i 
   */
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

  /**
   * 
   * @param replay 
   * @param replayList 
   * @param j 
   * 
   * 
   * @author swarup
   * 
   * @purpose delete comment
   */
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

  /**
   * 
   * @param date
   * 
   *  @author Swarup
   * 
   * @purpose give time differnces
   * 
   * @returns date
   */
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

  vid = document.getElementsByTagName('video');

  /***
   * @author Swarup
   * 
   * @purpose play video on display
   */
  // play the perticular video that visible to scrol position
  checkScroll() {
    $('video').each(function () {
      if ($(this).is(":in-viewport")) {
        $(this)[0].play();
      } else {
        $(this)[0].pause();
      }
    })

  }


  /**
    * @author Swarup Bhol
    * 
    * @purpose get all specialization
    * 
    * @returns void
    */
  getAllSpecialization() {
    this._as.getRequest(APIEndpoints.ALL_SPECIALIZATION).subscribe(
      response => { if (response.status == 200 && response.message == 'Success') this.dropdownList = response.result; },
      error => { this._ns.showSnakBar(Constant.SERVER_ERROR, "") })
  }
  /**
   * @author Swarup
   * 
   * @purpose get specialization by user
   * 
   * @returns String array
   */
  getUserSpecialization() {
    this._as.getRequest(APIEndpoints.SPECIALIZATION_BY_USER + this.userId).subscribe(
      response => { if (response.status == 200 && response.message == 'Success') this.selectedItems = response.result; },
      error => { this._ns.showSnakBar(Constant.SERVER_ERROR, "") })
  }
  onItemSelect(item: any) { }
  onSelectAll(items: any) {}



}
