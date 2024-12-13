import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { User } from '../../models/user.model';
import { environment } from 'src/environments/environment.development';

import { RegistrationService } from './registration.service'
import { Product } from '../../models/product.model';
import { MsoEvent } from 'src/app/models/mso-event.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  @Output() titleChange = new EventEmitter<string>();
  registerForm: FormGroup;
  eventOptions: MsoEvent[] = [];
  genders = ['male', 'female'];
  productList: Product[] = [];
  userList: User[] = [];
  filters = ["All"];
  selectedFilter = 'All';
  

  url = environment.URL;

  constructor(private http: HttpClient, private registrationService: RegistrationService) {}

  
  ngOnInit() {
    this.registerForm = new FormGroup({
      'eventObj': new FormControl(null, Validators.required),
      'userName': new FormControl(null, Validators.required),
      'description': new FormControl(null, [Validators.required]),
      'price': new FormControl(null, [Validators.required]),
      'noOfTickets': new FormControl(null, [Validators.required, this.ticketValidator])
    });

    this.getAllEvents();
    this.titleChange.emit('Create Products');
    this.getAllProducts();

  }

  ticketValidator(control: FormControl): {[s: string]:boolean} {
    if(control.value < 1) {
      return {'inValidNoOfTickets': true};
    }
    return null;
  }

  getAllEvents() {
    this.registrationService.getAllEventDetails().subscribe((res) => {
      console.log(res);
      this.eventOptions = res;
    }, (error) => {

    })
  }

  compareFn = (option1: any, option2: any): boolean => {
    return option1 && option2 ? option1._id === option2._id : option1 === option2;
  };

  onSubmit() {
    // console.log(this.registerForm);
    // console.log(this.registerForm.controls.userName.value);
    // console.log(this.registerForm.controls.bookingId.value);
    // console.log(this.registerForm.controls.email.value);
    // console.log(this.registerForm.controls.noOfTickets.value);    
    let productDetails: Product = {
      msoEvent: this.registerForm.controls.eventObj.value._id,
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
      .get<[Product]>( this.url + "/getAllProducts")
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
        this.productList = response.map(product => {
          const blob = new Blob([new Uint8Array(product.msoEvent.imageFile.data)], { type: 'image/jpeg' });
          return { ...product, imageUrl: URL.createObjectURL(blob) };
        });

        this.getFilter();
      });
  }

  // createImageFromBlob(imageData): string {
  //   imageData = new Uint8Array(imageData.data)
  //   const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust the MIME type as necessary
  //   return URL.createObjectURL(blob); // Create a URL for the blob
  // }

  getProductById(id) {
    this.registrationService.getProductById(id)
      .subscribe(res => {
      })
  }

  onDelete(id) {
    this.registrationService.deleteProductById(id)
      .subscribe(res => {
        this.getAllProducts();
      })
  }

  getFilter() {
    this.filters = ["All"];
    const categoriesSet = new Set(this.productList.map(product => product.msoEvent.name));
    categoriesSet.forEach(itemName => {
      this.filters.push(itemName);
    })
  }

  toggleFilter(filter) {
    this.selectedFilter = filter; // Set the selected filter
  }

  get filteredItems() {
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
