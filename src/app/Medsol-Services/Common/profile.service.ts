import { Injectable } from '@angular/core';
import { APIServiceService } from '../apiservice.service';
import { APIEndpoints } from 'src/app/Constants/APIEndpoints';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private _as:APIServiceService
  ) { }

  getProfileDetails(id){
    return this._as.getRequest(APIEndpoints.PROFILE+id);
  }
}
