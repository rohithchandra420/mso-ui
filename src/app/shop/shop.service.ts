import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Subject, catchError, pipe, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Product } from "../core/product.model";

@Injectable()
export class ShopService {
    productList: Product[];
    
    tempUrl = "http://localhost:3000";

    constructor(private http: HttpClient) {

    }

    getProductList() {
        return this.http.get<[Product]>(this.tempUrl + "/getAllProducts");


        // this. productList = [
        //     new Product("testID1", "Test Name 01", "testTitle1", 499, "Test Description", true, 5),
        //     new Product("testID2", "Test Name 02", "testTitle2", 699, "Test Description", true, 6),
        //     new Product("testID3", "Test Name 03", "testTitle3", 799, "Test Description", true, 7),
        //     new Product("testID4", "Test Name 04", "testTitle4", 899, "Test Description", true, 8),   
        // ];

    }
}