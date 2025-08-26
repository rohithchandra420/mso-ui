import { Injectable } from "@angular/core";
import { Ticket } from "../../models/ticket.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { User } from "../../models/user.model";
import { AuthService } from "../../core/auth.service";
import { exhaustMap, take } from "rxjs";
import { Product } from "../../models/product.model";
import { environment } from "src/environments/environment.development";
import { ImplicitReceiver } from "@angular/compiler";
import { MsoEvent } from "src/app/models/mso-event.model";

@Injectable({ providedIn: 'root' })

export class RegistrationService{
    url = environment.URL;

    constructor(private http: HttpClient, private authService: AuthService) { }

    getAllEventDetails() {
        return this.http.get<[MsoEvent]>(this.url + "/getAllEventDetails");
    }

    addProduct(productDetails: Product) {
        return this.http
            .post<Product>(this.url + "/addProduct", productDetails)
    }

    updateProduct(productDetails) {
        return this.http.patch<Product>(this.url + "/updateProduct", productDetails)
    }

    getProductById(productId: string) {
        return this.http.get<Product>(this.url + "/getProductById/" + productId, {
            params: new HttpParams().set('id', productId),
            responseType: 'json'
        });
    }

    deleteProductById(productId: string) {
        return this.http.delete<Product>(this.url + "/deleteProductById/" + productId, {
            params: new HttpParams().set('id', productId),
            responseType: 'json'
        });
    }

    changeProductStatusById(productId: string) {
        return this.http.post<Product>(this.url + "/changeProductStatusById/" + productId, "");
    }
}