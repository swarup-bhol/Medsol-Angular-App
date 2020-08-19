import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIServiceService {

  constructor(private _http: HttpClient) { }


  // Login/Signup API Request
  postRequest(url, payload): Observable<any> {
    return this._http.post(url, payload);
  }
  getRequest(url): Observable<any> {
    return this._http.get(url);
  }
  putRequest(url, payload): Observable<any> {
    return this._http.put(url, payload);
  }
  deleteRequest(url): Observable<any> {
    return this._http.delete(url);
  }

}
