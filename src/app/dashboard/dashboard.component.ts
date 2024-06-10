import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MousewheelEvents, NavigationEvents, PaginationEvents, SwiperOptions, A11yEvents } from 'swiper/types';
import { User } from '../core/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.user = {
      name: 'TestName',
      role: 'Admin',
      email: '',
      id: '',
      _token: ''
    };
  }

  goToShopPage() {    
    this.router.navigate(['/shop'])
  }


}
