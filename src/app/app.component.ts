import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './core/auth.service';

import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar'; 

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'dashboard-app-ui';
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';  

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    //localStorage.clear();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }

  ngOnInit() {
    this.authService.autoLogin();
  }

  openSnackBar(message: string, action: string) { 
    this._snackBar.open(message, action, { 
      duration: 2000, 
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    }); 
  } 
  
}


