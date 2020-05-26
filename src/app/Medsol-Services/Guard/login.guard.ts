import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../Auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate  {
  constructor(private route: Router, private authService: AuthenticationService) { }
  // Activate Route
    canActivate(): boolean {
      if (this.authService.isAuthenticated()) {
        this.route.navigate(['/']);
        return false;
      }
      return true;
    }
}
