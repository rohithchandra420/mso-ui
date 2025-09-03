import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TicketsService } from './tickets.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketDetailsPopUp } from './ticket.details.popup/ticket.details.popup';
import { QrScannerComponent } from './qrscanner-popup/qrscanner.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'phone', 'ticketId', 'orderId', 'paymentId', 'amount', 'createdAt'];
  dataSource;
  filterValue = "";
  selectedEvent;
  allEvents;
  eventFilters = [];
  displayedData;

  constructor(private ticketsService: TicketsService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllTickets();
    this.getEventFilter();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEventFilter() {
    this.eventFilters = [{ name: "All", _id: "all" }];
    this.ticketsService.getAllActiveEvents().subscribe((res) => {
      this.allEvents = res;
      console.log(this.allEvents);
      this.allEvents.forEach(event => {
        this.eventFilters.push(event);
      })
    }, (error) => {
      console.log("Error in fetching Events. Error: ", error);
    })
    this.selectedEvent = this.eventFilters[0];
  }

  toggleEventFilter(filter) {
    this.selectedEvent = filter; // Set the selected filter
    console.log("this.selectedEvent : ", this.selectedEvent);
    this.ticketsService.getTicketsByEventId(this.selectedEvent._id)
      .subscribe((res) => {
        this.populateTable(res)
      }, error => {
        console.log("Error GET TICKETS BY EVENT. ERROR : ", error);
      })
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
    this.displayedData = data;
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

  exportData() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.displayedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, this.selectedEvent.name);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

}
