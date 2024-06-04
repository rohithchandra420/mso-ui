import { Injectable } from "@angular/core";
import { Ticket } from "../core/ticket.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { User } from "../core/user.model";
import { AuthService } from "../core/auth.service";
import { exhaustMap, take } from "rxjs";

@Injectable({ providedIn: 'root' })

export class RegistrationService {
    url = "http://localhost:3000";

    constructor(private http: HttpClient, private authService: AuthService) { }

    registerTicket(ticketDetails: Ticket) {
        return this.http
            .post<[User]>(this.url + "/registerTicket", ticketDetails)
    }

    getTicketsById(ticketId: string) {
        return this.http.get<Ticket>(this.url + "/getTicketById/" + ticketId, {

            params: new HttpParams().set('id', ticketId),
            responseType: 'json'
        });
    }
}