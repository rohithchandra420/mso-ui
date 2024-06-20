import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TicketsService } from './tickets.service'; 

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TicketDetailsPopUp } from './ticket.details.popup/ticket.details.popup';
import { QrScannerComponent } from './qrscanner-popup/qrscanner.component';
 
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit{

  displayedColumns: string[] = ['name', 'email', 'phone', 'ticketId', 'orderId', 'paymentId', 'amount'];
  dataSource;
  filterValue="";

  constructor(private ticketsService:TicketsService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllTickets();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  openTicketDetails(row) {
    const dialogRef = this.dialog.open(TicketDetailsPopUp, {
      width: '500px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.getAllTickets();
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
