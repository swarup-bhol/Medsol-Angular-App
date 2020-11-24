import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedVarService {
  userId = null;
  post :any[any] = [];
  constructor() { }

  
  uploadPost = new BehaviorSubject<any>(this.post);
  userIdExist = new BehaviorSubject<any>(this.userId);
  // homeDivProperty = new BehaviorSubject<boolean>(this.homeDiv);
}
