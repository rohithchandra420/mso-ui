import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment.development";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "../../core/auth.service";
import { MsoEvent } from 'src/app/models/mso-event.model';


@Injectable({
  providedIn: 'root'
})
export class RegisterEventsService {
  url = environment.URL;

    constructor(private http: HttpClient, private authService: AuthService) { }

    addEvent(eventDetials: FormData) {
        return this.http
            .post<MsoEvent>(this.url + "/addEvent", eventDetials)
    }

    getAllEvents() {
      return this.http.get<[MsoEvent]>(this.url + "/getAllEvents");
    }

    getEventById(eventId: string) {
        return this.http.get<MsoEvent>(this.url + "/getEventById/" + eventId, {
            params: new HttpParams().set('id', eventId),
            responseType: 'json'
        });
    }

    deleteEventById(eventId: string) {
        return this.http.delete<MsoEvent>(this.url + "/deleteEventById/" + eventId, {
            params: new HttpParams().set('id', eventId),
            responseType: 'json'
        });
    }
}
