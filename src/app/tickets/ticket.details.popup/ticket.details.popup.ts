import { Component, Inject, OnInit } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Ticket } from "src/app/core/ticket.model";
import { TicketsService } from "../tickets.service";

@Component({
    selector: 'ticket-details-popup',
    templateUrl: './ticket.details.popup.html',
    styleUrls:['./ticket.details.popup.css']
})

export class TicketDetailsPopUp implements OnInit{

    constructor(public dialogRef: MatDialogRef<TicketDetailsPopUp>, private ticketService: TicketsService,
      @Inject(MAT_DIALOG_DATA) public ticketDetails: Ticket) {}
    
    ngOnInit(): void {   
        this.populatePopup(this.ticketDetails)
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    populatePopup(data) {
        //console.log(data);
    }

    onAdmit(ticket: Ticket) {
        console.log("Ticket: ",ticket)
        this.ticketService.updateTicketToAdmit(ticket).subscribe(res => {
          console.log(res);
          this.ticketDetails = res;
        }, error => {
          console.log(error);
        })
    }
  
  }