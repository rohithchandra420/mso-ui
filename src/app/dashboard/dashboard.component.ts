import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MousewheelEvents, NavigationEvents, PaginationEvents, SwiperOptions, A11yEvents } from 'swiper/types';
import { User } from '../core/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute) {
   
  }

  ngOnInit(){    
    this.user = {
      name: 'TestName',
      bookingId: this.route.snapshot.params['id'],      
      role: 'Admin',      
      ticketId: '',
      email: '',
      id: '',
      _token: ''
    };
  }

  testimonials = [
    { text: "This is the first testimonial. It's great!", author: "John Doe" },
    { text: "This is the second testimonial. Amazing work!", author: "Jane Smith" },
    { text: "This is the third testimonial. Keep it up!", author: "David Johnson" }
  ];

  // public config: SwiperOptions = {
  //   modules: [NavigationEve, Pagination, A11y, Mousewheel],
  //   autoHeight: true,
  //   spaceBetween: 20,
  //   navigation: false,
  //   pagination: {clickable: true, dynamicBullets: true},
  //   slidesPerView: 1,
  //   centeredSlides: true,
  //   breakpoints: {
  //     400: {
  //       slidesPerView: "auto",
  //       centeredSlides: false
  //     },
  //   }
  // }
  
}
