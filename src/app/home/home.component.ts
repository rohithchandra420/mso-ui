import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MousewheelEvents, NavigationEvents, PaginationEvents, SwiperOptions, A11yEvents } from 'swiper/types';
import { User } from '../core/user.model';
import { HomeService } from './home.service';

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
  imageUrl: string | null = null; // Initialize as null

  
  constructor(private homeService:HomeService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.user = {
      name: 'TestName',
      role: 'Admin',
      email: '',
      id: '',
      _token: ''
    };

    this.getAllImages();

    
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

  getAllImages() {
    this.homeService.getAllImages().subscribe((res) => {
      res.forEach(image => {
        this.imageUrl = this.createImageFromBlob(new Uint8Array(image.image.data)); // Set image URL
        this.bannerImageList.push(this.imageUrl);
      });
    })
  }

  getImageByName(imageName) {
    this.homeService.getImageByName(imageName).subscribe((res) => {
      this.imageUrl = this.createImageFromBlob(new Uint8Array(res.image.data)); // Set image URL
      this.bannerImageList.push(this.imageUrl);
    })
  }

  createImageFromBlob(imageData: Uint8Array): string {
    const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust the MIME type as necessary
    return URL.createObjectURL(blob); // Create a URL for the blob
  }


}
