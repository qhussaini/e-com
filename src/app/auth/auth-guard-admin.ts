import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import Swal from 'sweetalert2'

@Injectable()
export class AuthGuardAdmin implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuthAdmin = this.authService.getIsAuthAdmin();
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }else if (!isAuthAdmin) {
      this.router.navigate(['/']);
      Swal.fire({
        title: 'Not Authorise',
        text: "Your are not Authorise to visit this page click 'OK' to visit home page",
        icon: 'warning',
        confirmButtonText: 'OK',
        allowEscapeKey:false,
        allowOutsideClick:false,
        // cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/']);
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.isDismissed) {
          this.router.navigate(['/']);
        }
      })
    }
    return isAuth;
  }

}
