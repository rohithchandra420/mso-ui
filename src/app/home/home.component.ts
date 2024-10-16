import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MousewheelEvents, NavigationEvents, PaginationEvents, SwiperOptions, A11yEvents } from 'swiper/types';
import { User } from '../models/user.model';
import { HomeService } from './home.service';
import { ImageModel } from '../models/imageobj.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @Output() titleChange = new EventEmitter<string>();

  user: User;
  currentRoute;
  mainSlideImageList = [];
  shopBannerImageList = [];
  isViewEdit = false;
  bannerImgObjList: ImageModel[] = [];
  imageUrl: string | null = null; // Initialize as null
  selected;


  constructor(private homeService: HomeService, private route: ActivatedRoute, private router: Router,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.user = {
      name: 'TestName',
      role: 'Admin',
      email: '',
      id: '',
      _token: ''
    };

    this.titleChange.emit('Images  Upload');
    this.currentRoute = this.route.snapshot.url.join('/');
    this.getAllImages();


  }

  goToShopPage() {
    this.router.navigate(['/shop'])
  }

  editBannerOnClick() {
    this.isViewEdit = !this.isViewEdit;
  }

  updateBannerImages() {
    // let newImgSrc = this.bannerImg;
    // this.bannerImageList.push(...newImgSrc);
  }

  onFileSelected(event, imageObj: ImageModel, i: number) {
    console.log(event.target.files[0]);
    this.bannerImgObjList[i].imageFile = event.target.files[0];
    console.log(this.bannerImgObjList[i].imageFile.name);
  }

  uploadImage(imageData: ImageModel) {
    console.log("Uplaod", imageData)
    const formData = new FormData();
    formData.append('name', imageData.name);
    formData.append('description', imageData.description);
    formData.append('imgTag', imageData.imgTag);
    if (imageData.imageFile) {
      formData.append('imageFile', imageData.imageFile, imageData.imageFile.name);
    }

    this.homeService.uploadImage(formData).subscribe((res) => {
      this.openSnackBar("Image is Uploaded Successfully")
    }, (error) => {
      console.log("Upload Failed");
      this.openSnackBar("Image Upload Failed");
    })
  }

  addNewImageSpace() {
    this.bannerImgObjList.push({ name: '', description: '', imgTag: '', imageFile: null });
  }


  getAllImages() {
    this.homeService.getAllImages().subscribe((res) => {
      this.bannerImgObjList = res;
      res.forEach(image => {
        this.imageUrl = this.createImageFromBlob(new Uint8Array(image.imageFile.data)); // Set image URL
        if(image.imgTag == "mainSlideImage") {
          this.mainSlideImageList.push(this.imageUrl);
        } else if(image.imgTag == "shopBannerImage") {
          this.shopBannerImageList.push(this.imageUrl);
        }       
      });
    })
  }

  getImageByName(imageName) {
    this.homeService.getImageByName(imageName).subscribe((res) => {
      this.imageUrl = this.createImageFromBlob(new Uint8Array(res.imageFile.data)); // Set image URL
      this.mainSlideImageList.push(this.imageUrl);
    })
  }

  createImageFromBlob(imageData: Uint8Array): string {
    const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust the MIME type as necessary
    return URL.createObjectURL(blob); // Create a URL for the blob
  }

  deleteImage(imageData: ImageModel, index: number) {
    this.homeService.deleteImageByName(imageData.name).subscribe((res) => {
      this.bannerImgObjList[index] = { name: '', description: '', imgTag: '', imageFile: null };
      this.openSnackBar("Image is Deleted Successfully");

    }, (error) => {
      console.log(error);
      this.openSnackBar("Deletion Failed");
    })
  }

  openSnackBar(message) {
    this._snackBar.open(message, 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }



}
