import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ticket } from "src/app/core/ticket.model";
import { TicketsService } from "../tickets.service";

import html2canvas from 'html2canvas';

@Component({
  selector: 'ticket-details-popup',
  templateUrl: './ticket.details.popup.html',
  styleUrls: ['./ticket.details.popup.css']
})

export class TicketDetailsPopUp implements OnInit {

  @ViewChild('ticketCard') ticketCard: ElementRef<HTMLElement>;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  qrdata: string = "mso";
  showTicket = false;

  constructor(public dialogRef: MatDialogRef<TicketDetailsPopUp>, private ticketService: TicketsService,
    @Inject(MAT_DIALOG_DATA) public ticketDetails: Ticket) { }

  ngOnInit(): void {
    this.populatePopup(this.ticketDetails);
    this.createQrCode(this.ticketDetails);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  populatePopup(data) {
    //console.log(data);
  }

  onAdmit(ticket: Ticket) {
    console.log("Ticket: ", ticket)
    this.ticketService.updateTicketToAdmit(ticket).subscribe(res => {
      console.log(res);
      this.ticketDetails = res;
    }, error => {
      console.log(error);
    })
  }

  onShowTicket() {
    this.showTicket = !this.showTicket;
  }

  onDownloadTicket() {    
    this.downloadTicketPng();
  }

  createQrCode(data) {
    if (data) {
      let qrValues = {
        tid: data._id,
        oid: data.orderId,
        pid: data.paymentId,
      };
      this.qrdata = JSON.stringify(qrValues);
    } else {
      console.log("transDetails Not Ok");
    }
  }

  downloadTicketPng() {
    html2canvas(this.ticketCard.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = this.ticketDetails.name + '-mso-ticket.png';
      this.downloadLink.nativeElement.click();
    });
  }

}