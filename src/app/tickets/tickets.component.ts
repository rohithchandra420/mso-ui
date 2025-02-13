import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TicketsService } from './tickets.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketDetailsPopUp } from './ticket.details.popup/ticket.details.popup';
import { QrScannerComponent } from './qrscanner-popup/qrscanner.component';
import { MsoEvent } from '../models/mso-event.model';
import { Ticket } from '../models/ticket.model';
import { NotificationService } from '../core/notification.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'phone', 'ticketId', 'orderId', 'paymentId', 'amount', 'createdAt', 'hasEmailSent','actions'];
  dataSource;
  filterValue = "";
  eventOptions: MsoEvent[] = [];
  selectedEvent;
  selectedEventId = 'All'

  constructor(private ticketsService: TicketsService, public dialog: MatDialog, public notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.getAllEvents();
    this.getAllTickets();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllEvents() {
    this.ticketsService.getAllEventDetails().subscribe((res) => {
      console.log(res);
      this.eventOptions = res;
      //this.selectedEvent = res[this.eventOptions.length-1];
    }, (error) => {

    })
  }

  
  onEventFilterChange(event: any) {
    this.selectedEvent = event.value; // Update model
    console.log('Selected Value:',this.selectedEvent);
    this.getTicketsBySelectedEvent(this.selectedEvent);
    
  }

  getTicketsBySelectedEvent(selectedEvent) {
    if(selectedEvent) {
      this.ticketsService.getTicketsByEvenetId(selectedEvent._id).subscribe(res => {
        this.populateTable(res);
      }, error => {
  
      })
    }    
  }

  getAllTickets() {
    this.ticketsService.getAllTickets()
      .subscribe(res => {
        this.populateTable(res)
      }, error => {
        console.log("Error GET ALL TICKETS")
      })
  }


  populateTable(data) {
    this.dataSource = new MatTableDataSource(data)
  }

  sendTicketEmail(rowData: Ticket, index: number) {
    console.log(rowData);
    // this.ticketsService.sendTicketEMail(rowData).subscribe(res => {
    //   this.notificationService.openSucessSnackBar("Email sent Successfully");

    // }, error => {

    // })
  }

  openTicketDetails(row) {
    const dialogRef = this.dialog.open(TicketDetailsPopUp, {
      width: '500px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      //this.getAllTickets();      
      this.getTicketsBySelectedEvent(this.selectedEvent);
    });
  }

  openScanner() {
    const dialogRef = this.dialog.open(QrScannerComponent, {
      width: '90%',
      data: "Apple"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      //this.animal = result;
      this.filterValue = result;
      this.dataSource.filter = result.trim().toLowerCase();
    });
  }

}
