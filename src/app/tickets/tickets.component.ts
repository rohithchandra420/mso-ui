import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TicketsService } from './tickets.service'; 

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TicketDetailsPopUp } from './ticket.details.popup/ticket.details.popup';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface DialogData {
  animal: string;
  name: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];  
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit{

  displayedColumns: string[] = ['name', 'email', 'phone', 'ticketId', 'orderId', 'paymentId', 'amount'];
  dataSource;

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
        console.log(res)
        this.populateTable(res)
      }, error => {
        console.log("Error GET ALL TICKETS")
      })
  }

  populateTable(data) {
    this.dataSource = new MatTableDataSource(data)
  }

  openTicketDetails(row) {
    console.log(row); 
    const dialogRef = this.dialog.open(TicketDetailsPopUp, {
      width: '500px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      //this.animal = result;
    });
  }

  openScanner() {
    
  }

}
