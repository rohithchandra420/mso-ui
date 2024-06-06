import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Subject, catchError, pipe, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Product } from "./product.model";

@Injectable()
export class ShopService {
    productList: Product[];

    getProductList() {
        this. productList = [
            new Product("testID1", "Test Name 01", "testTitle1", 499, "Test Description", true),
            new Product("testID2", "Test Name 02", "testTitle2", 699, "Test Description", true),
            new Product("testID3", "Test Name 03", "testTitle3", 799, "Test Description", true),
            new Product("testID4", "Test Name 04", "testTitle4", 899, "Test Description", true),   
        ];

        return this.productList;

    }
}