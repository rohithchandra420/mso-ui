import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../core/product.model';
import { Ticket } from '../core/ticket.model';
import { ShopcartItem } from '../core/shopcartItem.model';

import {Observable} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import { StepperOrientation } from '@angular/material/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

  productList: Product[];
  ticket: Ticket;
  shopCartItems: [];
  count: number;
  totalAmount: number;

  checkOutForm: FormGroup;
  paymentForm: FormGroup;
  firstFormGroup: FormGroup;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private shopService: ShopService, breakpointObserver: BreakpointObserver,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.firstFormGroup =  new FormGroup({
      'testInput': new FormControl(null, Validators.required),
    });

    this.checkOutForm = new FormGroup({
      'userName': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'phoneNumber': new FormControl(null, [Validators.required, this.mobileValidator])
    });

    this.paymentForm =  new FormGroup({
      'totalPrice': new FormControl(null, Validators.required)
    });

    this.loadProducts();
    this.count = 0;
    this.totalAmount = 0;
    this.createTicket();
  }

  mobileValidator(control: FormControl): {[s: string]:boolean} {
    if(control.value < 5) {
      return {'inValidNoOfTickets': true};
    }
    return null;
  }

  loadProducts() {
    this.shopService.getProductList().subscribe(res => {
      console.log(res);
      this.productList = res;
    });
  }
  
  addProductToCart(product: Product) {
    product.count++;
    let item = this.productList.filter(prod => prod._id == product._id);
    console.log("item: ", item);
    this.totalAmount = this.totalAmount + item[0].price;
    let shopItem = new ShopcartItem(product._id, product.name, product.price);
    this.ticket.shopCart.push(shopItem);    
    
    console.log(this.ticket);
  }

  removeProductFromCart(product: Product) {
    product.count--;
    let item = this.ticket.shopCart.find(prod => prod._id == product._id);
    console.log("Remove Item: ", item)
    this.totalAmount = this.totalAmount + item[0].price;
    let index = this.ticket.shopCart.indexOf(item);
    if(index > -1) {
      this.ticket.shopCart.splice(index, 1);
    }
    console.log(this.ticket);
  }

  createTicket() {
    this.ticket = new Ticket("testName", "testEmail@mso.com", "testbookid", "testId", []);
  }
  
  onSubmit() {
    console.log("submit");
  }


}
