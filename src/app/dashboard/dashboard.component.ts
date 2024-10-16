import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MousewheelEvents, NavigationEvents, PaginationEvents, SwiperOptions, A11yEvents } from 'swiper/types';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= true;
  isCollapsed = true;
  childTitle: string = 'Welcome to Dashboard';

  constructor(private route: ActivatedRoute, private router: Router, private observer: BreakpointObserver,
    private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar ) {

  }

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  setChildTitle(title: string) {
    this.childTitle = title;
  }

  onActivate(componentRef: any) {
    if (componentRef.titleChange) {
      componentRef.titleChange.subscribe((title: string) => {
        this.childTitle = title;
        this.cdr.detectChanges();
      });
    }
  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }

  openSnackBar() {
    this._snackBar.open('Cannonball!!', 'Splash', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  

}
