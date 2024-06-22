import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Ticket } from "../core/ticket.model";
import { environment } from "src/environments/environment.development";

@Injectable()
export class TicketsService {

    url = environment.URL;

    constructor(private http:HttpClient) {

    }

    getAllTickets() {
        return this.http.get<[Ticket]>(this.url + "/GetAllTickets");
    }

    updateTicketToAdmit(ticket: Ticket) {
        let data = {
            _id: ticket._id
        };
        return this.http.post<Ticket>(this.url + "/AdmitTicket", data);
    }
}