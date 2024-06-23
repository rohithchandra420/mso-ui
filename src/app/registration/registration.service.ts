import { Injectable } from "@angular/core";
import { Ticket } from "../core/ticket.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { User } from "../core/user.model";
import { AuthService } from "../core/auth.service";
import { exhaustMap, take } from "rxjs";
import { Product } from "../core/product.model";
import { environment } from "src/environments/environment.development";

@Injectable({ providedIn: 'root' })

export class RegistrationService {
    url = environment.URL;

    constructor(private http: HttpClient, private authService: AuthService) { }

    addProduct(productDetials: Product) {
        return this.http
            .post<Product>(this.url + "/addProduct", productDetials)
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
}