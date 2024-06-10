import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { User } from '../core/user.model';

import { RegistrationService } from './registration.service'
import { Product } from '../core/product.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  genders = ['male', 'female'];
  productList: Product[] = [];
  userList: User[] = [];
  

  url = "http://localhost:3000/";

  constructor(private http: HttpClient, private registrationService: RegistrationService) {}

  
  ngOnInit() {
    this.registerForm = new FormGroup({
      'userName': new FormControl(null, Validators.required),
      'description': new FormControl(null, [Validators.required]),
      'price': new FormControl(null, [Validators.required]),
      'noOfTickets': new FormControl(null, [Validators.required, this.ticketValidator])
    });

    this.getAllProducts();

  }

  ticketValidator(control: FormControl): {[s: string]:boolean} {
    if(control.value < 1) {
      return {'inValidNoOfTickets': true};
    }
    return null;
  }

  onSubmit() {
    // console.log(this.registerForm);
    // console.log(this.registerForm.controls.userName.value);
    // console.log(this.registerForm.controls.bookingId.value);
    // console.log(this.registerForm.controls.email.value);
    // console.log(this.registerForm.controls.noOfTickets.value);
    
    let productDetails: Product = {
      name: this.registerForm.controls.userName.value,
      price: this.registerForm.controls.price.value,
      description: this.registerForm.controls.description.value,
      active: false,
      remainingCount: this.registerForm.controls.noOfTickets.value,
    };
    //this.initTest() ;

    this.registrationService.addProduct(productDetails)
      .subscribe(response => {
        //this.userList = response;      
         console.log("response: ", response);
         this.getAllProducts();
        // console.log("userList: ", this.userList);
    }, error => {
        console.log("Error: ", error);
    });
  }

  getAllProducts() {
    this.http
      .get<[Product]>("http://localhost:3000/getAllProducts")
      .pipe(map(responseData => {
        const postsArray = [];
        for(const key in responseData) {
          if(responseData.hasOwnProperty(key)) {
            postsArray.push({...responseData[key]});
          }          
        }
        return postsArray;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      }))
      .subscribe(response => {
        console.log(response);
        this.productList = response;
      });
  }

  getProductById(id) {
    this.registrationService.getProductById(id)
      .subscribe(res => {
        console.log("ByID", res);
      })
  }

  onDelete(id) {
    console.log(id);
    this.registrationService.deleteProductById(id)
      .subscribe(res => {
        this.getAllProducts();
      })
  }


  

}
