import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Ticket } from "../core/ticket.model";

@Injectable()
export class TicketsService {

    tempUrl = "http://localhost:3000";

    constructor(private http:HttpClient) {

    }

    getAllTickets() {
        return this.http.get<[Ticket]>(this.tempUrl + "/GetAllTickets");
    }
}