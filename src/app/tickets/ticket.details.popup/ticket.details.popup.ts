import { Component, Inject, OnInit } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Ticket } from "src/app/core/ticket.model";

@Component({
    selector: 'ticket-details-popup',
    templateUrl: './ticket.details.popup.html',
    styleUrls:['./ticket.details.popup.css']
})

export class TicketDetailsPopUp implements OnInit{

    constructor(
      public dialogRef: MatDialogRef<TicketDetailsPopUp>,
      @Inject(MAT_DIALOG_DATA) public ticketDetails: Ticket) {}
    
    ngOnInit(): void {   
        this.populatePopup(this.ticketDetails)
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    populatePopup(data) {
        console.log(data);
    }

    onAdmit(item) {
        let ticketId = this.ticketDetails._id;
        console.log("Item: ",item)
    }
  
  }