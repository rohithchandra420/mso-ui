import { Injectable } from "@angular/core";
import { Transaction } from "src/app/models/transaction.model";

import { environment } from "src/environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Ticket } from "src/app/models/ticket.model";

@Injectable()
export class TransactionDetailsService {
    url = environment.URL;

    constructor(private http: HttpClient) {

    }

    getAllIncompleteTransactions() {
        return this.http.get<[Transaction]>(this.url + "/GetAllIncompleteTransactions");
    }

    completeTransaction(txn: Transaction) {
        return this.http.post<Ticket>(this.url + "/completeTransaction", txn);
    }

}