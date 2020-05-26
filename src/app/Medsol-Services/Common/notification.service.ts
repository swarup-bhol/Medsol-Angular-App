import { Injectable } from '@angular/core';
import {  MatSnackBar,  MatSnackBarHorizontalPosition,  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  showSnakBar(message:string,action :string){
    this._snackBar.open(message, action, {
      duration: 500,
      horizontalPosition: this.horizontalPosition,
      // verticalPosition: this.verticalPosition,
    });
  }
}
