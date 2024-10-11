import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MousewheelEvents, NavigationEvents, PaginationEvents, SwiperOptions, A11yEvents } from 'swiper/types';
import { User } from '../core/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  user: User;
  bannerImageList = [];
  isViewEdit = false;
  bannerImg = [];

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

    this.getBannerImages();
  }

  goToShopPage() {    
    this.router.navigate(['/shop'])
  }

  editBannerOnClick() {
    this.isViewEdit = !this.isViewEdit;
  }

  addBannerImages() {
    
  }

  getBannerImages() {
    this.bannerImageList.push("assets/slide1.png");
  }

  editBannerImages() {

  }

  updateBannerImages() {
    let newImgSrc = this.bannerImg;
    this.bannerImageList.push(...newImgSrc);
  }


}
