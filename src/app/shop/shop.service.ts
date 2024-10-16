import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Subject, catchError, pipe, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Product } from "../models/product.model";
import { Ticket } from "../models/ticket.model";
import { environment } from "src/environments/environment.development";
import { ImageModel } from "../models/imageobj.model";

@Injectable()
export class ShopService {
    productList: Product[];
    
    url = environment.URL;

    constructor(private http: HttpClient) {

    }

    getProductList() {
        return this.http.get<[Product]>(this.url + "/getAllProducts");


        // this. productList = [
        //     new Product("testID1", "Test Name 01", "testTitle1", 499, "Test Description", true, 5),
        //     new Product("testID2", "Test Name 02", "testTitle2", 699, "Test Description", true, 6),
        //     new Product("testID3", "Test Name 03", "testTitle3", 799, "Test Description", true, 7),
        //     new Product("testID4", "Test Name 04", "testTitle4", 899, "Test Description", true, 8),   
        // ];

    }

    getBannerImage() {
        const params = new HttpParams().set('type', "shopBannerImage");
        return this.http.get<ImageModel>(this.url + "/getAllImages", { params })
    }

    onCreateRazorpayOrder(orderData) {
        return this.http.post<any>(this.url + "/order", orderData);
    }

    onCapturePayment(razorData) {
        // const httpHeaders: HttpHeaders = new HttpHeaders({
        //     RazorpaySignature: razorData.successData.razorpay_signature
        // });
        // delete razorData.successData.razorpay_signature;
        //console.log(razorData);
        return this.http.post(this.url + "/paymentCapture", razorData );
    }
}