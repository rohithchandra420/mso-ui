// import { CanActivateFn } from "@angular/router";

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "./auth.service";


// export function authGuard(): CanActivateFn {
//     return () => {
//         const featureFlagsService: FeatureFlagsService = 
//     };
// }

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //     return this.authService.isAuthenticated().then(
    //         (authenticated: boolean) => {
    //             if(authenticated) {
    //                 return true;
    //             } else {
    //                 this.router.navigate(['/']);
    //             }
    //         }
    //         );

        return this.authService.user.pipe(map( user => {
            return !user ? false : true; 
        }));
    }
}