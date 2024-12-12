import { NgModule, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from "@angular/router";

import { DashboardComponent } from "../dashboard/dashboard.component";
import { HomeComponent } from "../home/home.component";
import { LoginComponent } from "../login/login.component";
import { RegistrationComponent } from "../registration/registration.component";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { authGuard } from "./auth.guard";
import { ErrorPageComponent } from "../error-page/error-page.component";
import { AuthResolver } from "./auth-resolver.service";
import { AdminComponent } from "../admin/admin.component";
import { ShopComponent } from "../shop/shop.component";
import { TicketsComponent } from "../tickets/tickets.component";
import { ImageBoardComponent } from "../image-board/image-board.component";

const profileGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
):  | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {
        const currentUser = inject(AuthService).isAuthenticated();

        //Redirect to Another Route
        if(!currentUser) {
            return inject(Router).createUrlTree(["/", "login"]);
        }

        //const profileId = route.params["id"];
        
        //Grants or deny access to this route
        
        return true;
    }

// export function featureFlagHuard( ):CanActivateChildFn {
//     return() => {
//         const authService: AuthService = inject(AuthService);
//         if(authService.isAuthenticated()) {
//             return true;
//         } else {
//             return false;
//         }
//     };
// }

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    // {
    //     path: '', canActivate:[authGuard], resolve: {userDetails: AuthResolver} , component: HomeComponent, children: [
    //         { path: 'dashboard', component: DashboardComponent },
    //         { path: 'register', component: RegistrationComponent }
    //     ]
    // },
    { path: 'home', component: HomeComponent},
    { path: 'dashboard', canActivate:[authGuard] , component: DashboardComponent, children: [
            { path: 'imageboard', component: ImageBoardComponent },
            { path: 'register', component: RegistrationComponent},
        ]
    },
    { path: 'admin', canActivate:[authGuard] , component: AdminComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'tickets', component: TicketsComponent },
    { path: 'error', component: ErrorPageComponent, data: {message: 'Page Under Construction'}},
    { path: '**', redirectTo: '/home' },

];

//add useHash
@NgModule({
    imports: [        
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {
}