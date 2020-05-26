import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntercepterService {

  constructor(private authService: AuthenticationService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
     
      request = request.clone({
        setHeaders: {
          Authorization:`Bearer ${this.authService.getToken()}`
        }
      });
    }
    return next.handle(request);
  }
}
