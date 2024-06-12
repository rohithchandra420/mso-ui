import { Component, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../core/product.model';
import { Ticket } from '../core/ticket.model';
import { ShopcartItem } from '../core/shopcartItem.model';

import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WindowRefService } from '../window-ref.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

  @ViewChild('stepper') private myStepper: MatStepper;

  productList: Product[];
  ticket: Ticket;
  shopCartItems: [];
  count: number;
  totalAmount: number;
  paymentSuccess: boolean;
  transactionDetails;

  checkOutForm: FormGroup;
  paymentForm: FormGroup;
  firstFormGroup: FormGroup;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private shopService: ShopService, breakpointObserver: BreakpointObserver, private winRef: WindowRefService) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.paymentSuccess = false;
    this.transactionDetails = {
      status:'',
      payload: {}
    };

    this.firstFormGroup = new FormGroup({
      'testInput': new FormControl(null, Validators.required),
    });

    this.checkOutForm = new FormGroup({
      'userName': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'phoneNumber': new FormControl(null, [Validators.required, this.mobileValidator])
    });

    this.paymentForm = new FormGroup({
      'totalPrice': new FormControl(null, Validators.required)
    });

    this.loadProducts();
    this.count = 0;
    this.totalAmount = 0;
    this.createTicket();
  }

  mobileValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value < 5) {
      return { 'inValidNoOfTickets': true };
    }
    return null;
  }

  loadProducts() {
    this.shopService.getProductList().subscribe(res => {
      this.productList = res;
    });
  }

  addProductToCart(product: Product) {
    product.count++;
    let item = this.productList.filter(prod => prod._id == product._id);
    this.totalAmount = this.totalAmount + item[0].price;
    let shopItem = new ShopcartItem(product._id, product.name, product.price);
    this.ticket.shopCart.push(shopItem);

  }

  removeProductFromCart(product: Product) {
    product.count--;
    let item = this.ticket.shopCart.find(prod => prod._id == product._id);
    this.totalAmount = this.totalAmount + item[0].price;
    let index = this.ticket.shopCart.indexOf(item);
    if (index > -1) {
      this.ticket.shopCart.splice(index, 1);
    }
  }

  createTicket() {
    this.ticket = new Ticket("testName", "testEmail@mso.com", 91, "testbookid", "testId", []);
  }

  onSubmit() {
  }

  createRazorpayOrder() {
    this.paymentSuccess = true;
    this.myStepper.next();

    const txnData = {
      name: this.checkOutForm.controls.userName.value,
      email: this.checkOutForm.controls.email.value,
      phone: this.checkOutForm.controls.phoneNumber.value,
      amount: this.totalAmount,
    }
    this.shopService.onCreateRazorpayOrder(txnData)
      .subscribe(
        (res) => {
          const order_id = res.order_id;
          this.payWithRazor(order_id, txnData);
        },
        (error) => {
          console.log("Error!: ", error);
        }
      )
  }

  payWithRazor(orderId, txnData) {
    debugger;
    const options: any = {
      key: 'rzp_test_Y9m41KlJg2w3JL',
      amount: txnData.amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'rc_hellboy', // company name or product name
      description: '',  // product description
      image: '../../assets/logo.png', // company logo or product image
      order_id: orderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      },
      prefill: {
        "name": txnData.name,
        "email": txnData.email,
        "contact": txnData.phone       
      }
    };

    options.handler = ((response, error) => {
      //options.response = response;
      txnData.successData = response;
      txnData.shopCart = this.ticket.shopCart;
      this.shopService.onCapturePayment(txnData)
        .subscribe((res) => {
          console.log("SUCCESS");
          this.transactionDetails = res;
          console.log(this.transactionDetails)
        }, (error) => {

          console.log("ERROR!: ", error.error);
        });
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();

  }

  showTransactionMessage (data) {
    console.log("transaction msg : ", data);
  }


}
