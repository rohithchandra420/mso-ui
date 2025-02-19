import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../models/product.model';
import { Ticket } from '../models/ticket.model';
import { ShopcartItem } from '../models/shopcartItem.model';

import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WindowRefService } from '../window-ref.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

import html2canvas from 'html2canvas';

export class NgxQrCode {
  text: string;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild('ticketCard') downloadContent: ElementRef<HTMLElement>;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  productList: Product[] = [];
  order_id: string;
  ticket: Ticket;
  shopCartItems: [];
  count: number;
  totalAmount: number;
  isPaymentSuccess: boolean;
  isCaptured = false;
  transactionDetails;
  qrdata: string = "mso";
  ticketName: string;
  shopBannerImageUrl; // Initialize as null
  filters = [];
  selectedFilter;
  selectedEventId;
  loading = false;


  checkOutForm: FormGroup;
  paymentForm: FormGroup;
  firstFormGroup: FormGroup;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private router: Router, private zone: NgZone, private shopService: ShopService,
    breakpointObserver: BreakpointObserver, private winRef: WindowRefService) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.isPaymentSuccess = false;
    this.transactionDetails = {
      status: '',
      payload: {}
    };

    this.ticket = new Ticket("userName", "userEmail", 1234567890, "oid", 1, "New", false, new Date, "", [],);

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
    this.loadBannerImg();
  }

  mobileValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value < 5) {
      return { 'inValidNoOfTickets': true };
    }
    return null;
  }

  loadProducts() {
    this.loading = true;
    this.shopService.getProductList().subscribe(res => {
      this.productList = res;
      this.getFilter();
      this.loading = false;
    });
  }

  loadBannerImg() {
    this.shopService.getBannerImage().subscribe((res) => {
      this.shopBannerImageUrl = this.createImageFromBlob(new Uint8Array(res[0].imageFile.data)); // Set image URL
    }, (error) => {

    });
  }

  createImageFromBlob(imageData: Uint8Array): string {
    const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust the MIME type as necessary
    return URL.createObjectURL(blob); // Create a URL for the blob
  }

  addProductToCart(product: Product) {
    product.count++;
    let item = this.productList.filter(prod => prod._id == product._id);
    this.totalAmount = this.totalAmount + item[0].price;
    let shopItem = new ShopcartItem(product._id, product.name, product.price, "New");
    this.ticket.shopCart.push(shopItem);

  }

  removeProductFromCart(product: Product) {
    product.count--;
    let item = this.ticket.shopCart.find(prod => prod._id == product._id);
    this.totalAmount = this.totalAmount - item.price;
    let index = this.ticket.shopCart.indexOf(item);
    if (index > -1) {
      this.ticket.shopCart.splice(index, 1);
    }
  }

  onSubmit() {
  }

  createRazorpayOrder() {
    this.isCaptured = false;
    this.loading = true;
    const txnData = {
      name: this.checkOutForm.controls.userName.value,
      email: this.checkOutForm.controls.email.value,
      phone: this.checkOutForm.controls.phoneNumber.value,
      amount: this.totalAmount,
      shopCart: this.ticket.shopCart,
      msoEvent: this.selectedEventId
    }
    this.shopService.onCreateRazorpayOrder(txnData)
      .subscribe(
        (res) => {
          this.order_id = res.order_id;
          this.payWithRazor(this.order_id, txnData);
        },
        (error) => {
          console.log("Error!: ", error);
        }
      )
  }

  payWithRazor(orderId, txnData) {
    const options: any = {
      key: environment.RAZ_API_KEY,
      amount: txnData.amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Make Some Ochha', // company name or product name
      description: '',  // product description
      image: '../../assets/logo.png', // company logo or product image
      order_id: orderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
        backdropclose: false,
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
      this.zone.run(() => {
        txnData.successData = response;
        txnData.shopCart = this.ticket.shopCart;
        txnData.msoEvent = this.selectedEventId;
        this.isCaptured = true;
        this.shopService.onCapturePayment(txnData)
          .subscribe((res: { status: string, payload: Ticket }) => {
            this.transactionDetails.status = res.status;
            this.transactionDetails.payload = res.payload;
            this.createQrCode(this.transactionDetails);
            this.isPaymentSuccess = true;
            this.stepper.next();
            this.loading = false;
          }, (error) => {
            this.loading = false;
            this.isCaptured = true;
            this.isPaymentSuccess = false;
            console.log("ERROR!: ", error.error);
            this.stepper.next();
          });
      })

      // call your backend api to verify payment signature & capture transaction
    });


    options.modal.ondismiss = (() => {
      //TODO: Func on DIsmiss 
      this.zone.run(() => {
        this.loading = false;
        this.isCaptured = true;
        this.isPaymentSuccess = false;
        this.stepper.next();
        console.log("ERROR!: ");
        // handle the case when user closes the form while transaction is in progress
      })
    });

    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();

  }

  createQrCode(data) {
    if (data || data.status == 'ok') {
      let qrValues = {
        tid: data.payload._id,
        oid: data.payload.orderId,
        pid: data.payload.paymentId,
      };
      this.qrdata = JSON.stringify(qrValues);
    } else {
      console.log("transDetails Not Ok");
    }
  }

  downloadTicket() {
    html2canvas(this.downloadContent.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'makesomeocha-ticket.png';
      this.downloadLink.nativeElement.click();
    });
  }

  goHome() {
    this.router.navigate(['/home'])
  }

  getFilter() {
    const eventNameSets = new Set(this.productList.map(product => product.msoEvent.name));
    eventNameSets.forEach(itemName => {
      this.filters.push(itemName);
    })
    this.selectedFilter = this.filters[0];
    
    const uniqueMsoEvents = Array.from(
      new Map(this.productList.map(product => [product.msoEvent._id, product.msoEvent])).values()
    );
    const selectedEvent = uniqueMsoEvents.filter(event => event.name === this.selectedFilter); 
    this.selectedEventId = selectedEvent[0]._id;
    //this.selectedEventId = this.
  }

  toggleFilter(filter) {
    this.selectedFilter = filter; // Set the selected filter
    this.ticket.shopCart = []; //Resets the shopcart on every filter change
    this.productList.forEach((product) => {
      product.count = 0;
    })
    this.totalAmount = 0;
  }

  get filteredItems() {
    const uniqueMsoEvents = Array.from(
      new Map(this.productList.map(product => [product.msoEvent._id, product.msoEvent])).values()
    );
    // eventSets.filter(event => {

    // })
    //this.selectedEventId =
    const selectedEvent = uniqueMsoEvents.filter(event => event.name === this.selectedFilter); 
    this.selectedEventId = selectedEvent[0]._id;

    return this.selectedFilter === 'All'
      ? this.productList
      : this.productList.filter(item => {
        // Match for tent_type or tent_no directly
        const matches = item.msoEvent.name?.toLowerCase().includes(this.selectedFilter.toLowerCase());
        // const matchesTentNo = item.tent_no?.toLowerCase().includes(this.selectedFilter.toLowerCase());

        // Match for occupants' properties (name and order_id) if occupants exist
        // const matchesOccupant = item.occupants?.some(occupant => 
        //   occupant?.name?.toLowerCase().includes(this.selectedFilter.toLowerCase()) ||
        //   (occupant?.order_id?.toString().includes(this.selectedFilter))
        // );

        // Return true if any of the properties match the filter
        return matches;
      });
  }


}
