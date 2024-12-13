import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Subject, catchError, pipe, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { ImageModel } from "../../models/imageobj.model"

@Injectable()
export class ImageBoardService {

    url = environment.URL;

    constructor(private http: HttpClient) {

    }

    getImageByName(imageName) {
        return this.http.get<ImageModel>(this.url + "/getImageByName/" + imageName);

        // this. productList = [
        //     new Product("testID1", "Test Name 01", "testTitle1", 499, "Test Description", true, 5),
        //     new Product("testID2", "Test Name 02", "testTitle2", 699, "Test Description", true, 6),
        //     new Product("testID3", "Test Name 03", "testTitle3", 799, "Test Description", true, 7),
        //     new Product("testID4", "Test Name 04", "testTitle4", 899, "Test Description", true, 8),   
        // ];

    }

    getAllImages() {
        //const params = new HttpParams().set('type', "Main Slide Image");
        return this.http.get<[ImageModel]>(this.url + "/getAllImages");
    }

    uploadImage(imageData: FormData) {
        return this.http.post(this.url + "/uploadImage", imageData);
    }

    deleteImageByName(imageName) {
        return this.http.delete(this.url + "/deleteImageByName/" + imageName);
    }

}