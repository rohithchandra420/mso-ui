import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Ticket } from '../core/ticket.model';
import { User } from '../core/user.model';

import { RegistrationService } from './registration.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  genders = ['male', 'female'];
  ticketList: Ticket[] = [];
  userList: User[] = [];
  

  url = "http://localhost:3000/";

  constructor(private http: HttpClient, private registrationService: RegistrationService) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      'userName': new FormControl(null, Validators.required),
      'bookingId': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'noOfTickets': new FormControl(null, [Validators.required, this.ticketValidator])
    });
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
    
    let ticketDetails: Ticket = {
      name: this.registerForm.controls.userName.value,
      email: this.registerForm.controls.email.value,
      bookingId: this.registerForm.controls.bookingId.value,
      noOfTickets: this.registerForm.controls.noOfTickets.value
    };
    //this.initTest() ;

    // this.registrationService.registerTicket(ticketDetails)
    //   .subscribe(response => {
    //     this.userList = response;      
    //     console.log("response: ", response);
    //     console.log("userList: ", this.userList);
    // }, error => {
    //     console.log("Error: ", error);
    // });

    this.registrationService.getTicketsById("655efa7628adfb1804ffc7e0")
      .subscribe(res => {
        console.log(res);
      })
  }



  initTest() {
    this.http
      .get<[Ticket]>("http://localhost:3000/getAllTicketDetails")
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
        this.ticketList = response;
      });
  }

  

}
