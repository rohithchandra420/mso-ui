import { Component, OnInit } from '@angular/core';
import { TransactionDetailsService } from './transaction-details.service';
import { NotificationService } from 'src/app/core/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'phone', 'orderId', 'paymentId', 'amount', 'createdAt'];
  dataSource;
  filterValue = "";
  name:string = "";
  email;
  phone;
  orderId;
  paymentId;
  msoEvent;
  shopCart;
  amount;

  constructor(private transactionDetailsService: TransactionDetailsService, public notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.getAllIncompleteTransactions();
  }

  getAllIncompleteTransactions() {
    this.transactionDetailsService.getAllIncompleteTransactions().subscribe(res => {
      console.log(res);
      this.populateTable(res);
    }, error => {

    })
  }

  populateTable(data) {
    this.dataSource = new MatTableDataSource(data)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editTransaction(row) {
    console.log(row);
    this.name = row.name;
    this.email = row.email;
    this.phone = row.phone;
    this.orderId = row.orderId;
    this.shopCart = row.shopCart;
    this.amount = row.amount;
    this.msoEvent = row.msoEvent;

    this.transactionDetailsService.completeTransaction
  }

  completeTxn() {
    let txn = new Transaction(this.name, this.email, this.phone, this.orderId, this.amount, "New", this.msoEvent, null, null, this.shopCart, this.paymentId);
    this.transactionDetailsService.completeTransaction(txn).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
      this.notificationService.openErrorSnackBar(error);
    })
  }
}
