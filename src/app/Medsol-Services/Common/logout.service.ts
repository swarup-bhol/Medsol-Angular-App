import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedVarService } from './shared-var.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private _router: Router,private _bs: SharedVarService) { }
  logout() {
    localStorage.clear();
    this._bs.userIdExist.next(null);
    this._router.navigate(['/login']);
    // location.reload();
  }
}
