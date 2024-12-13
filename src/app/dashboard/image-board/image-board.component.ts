import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ImageBoardService } from './image-board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageModel } from '../../models/imageobj.model';

@Component({
  selector: 'app-image-board',
  templateUrl: './image-board.component.html',
  styleUrls: ['./image-board.component.css']
})
export class ImageBoardComponent implements OnInit {
  @Output() titleChange = new EventEmitter<string>();
  currentRoute;
  mainSlideImageList = [];
  shopBannerImageList = [];
  bannerImgObjList: ImageModel[] = [];
  imageUrl: string | null = null; // Initialize as null

  constructor(private imageBoardService: ImageBoardService, private route: ActivatedRoute, private router: Router,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.titleChange.emit('Images  Upload');
    this.currentRoute = this.route.snapshot.url.join('/');
    this.getAllImages();
  }

  getAllImages() {
    this.imageBoardService.getAllImages().subscribe((res) => {
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
    this.imageBoardService.getImageByName(imageName).subscribe((res) => {
      this.imageUrl = this.createImageFromBlob(new Uint8Array(res.imageFile.data)); // Set image URL
      this.mainSlideImageList.push(this.imageUrl);
    })
  }

  createImageFromBlob(imageData: Uint8Array): string {
    const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust the MIME type as necessary
    return URL.createObjectURL(blob); // Create a URL for the blob
  }

  addNewImageSpace() {
    this.bannerImgObjList.push({ name: '', description: '', imgTag: '', imageFile: null });
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

    this.imageBoardService.uploadImage(formData).subscribe((res) => {
      this.openSnackBar("Image is Uploaded Successfully")
    }, (error) => {
      console.log("Upload Failed");
      this.openSnackBar("Image Upload Failed");
    })
  }

  deleteImage(imageData: ImageModel, index: number) {
    this.imageBoardService.deleteImageByName(imageData.name).subscribe((res) => {
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
