import { Injectable, EventEmitter } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { LoginService } from "./login.service";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  constructor(
    public httpClient: HttpClient,
    private loginService: LoginService,
  ) {}

  private url = "http://localhost:3000"; // Example API URL

  data: any[] = [];

  // display all event [Just a select * from events]
  displayEvents(): Observable<any> {
    const headers = new HttpHeaders().set("content-type", "application/json");

    return this.httpClient
      .get<any[]>(this.url + "/event/getAllEvents", { headers })
      .pipe(
        tap((data) => {
          // console.log(data)
        }),
        catchError(this.handleError),
      );
  }

  displayVenue(): Observable<any> {
    const headers = new HttpHeaders().set("content-type", "application/json");

    return this.httpClient.get<any[]>(this.url + "/venues", { headers }).pipe(
      tap((databack) => {
        console.log(databack);
        console.log("end of service\n");
      }),
      catchError(this.handleError),
    );
  }

  viewEventDetails(eventID: any): Observable<any> {
    const headers = new HttpHeaders().set("content-type", "application/json");

    return this.httpClient
      .get<any[]>(this.url + "/event/getEvent/" + eventID, { headers })
      .pipe(
        tap((databack) => {
          console.log("received data back from service");
        }),
        catchError(this.handleError),
      );
  }
  // Check the details of the event im organizing
  viewMyEventDetails(eventID: any): Observable<any> {
    var token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .get<any[]>(this.url + "/event/getMyEventDetails/" + eventID, { headers })
      .pipe(
        tap((databack) => {
          console.log("received data back from service");
        }),
        catchError(this.handleError),
      );
  }

  // display all event [Just a select * from events]
  getTickets(): Observable<any> {
    var token = this.loginService.getToken();
    console.log(token);
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .get<any[]>(this.url + "/event/getTickets", { headers })
      .pipe(
        tap((data) => {
          console.log(data);
        }),
        catchError(this.handleError),
      );
  }

  createEvent(eventData: any): Observable<any> {
    var token = this.loginService.getToken();

    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .post<any[]>(this.url + "/event/createEvent", eventData, { headers })
      .pipe(
        tap((data) => {
          //   console.log(data);
        }),
        catchError(this.handleError),
      );
  }

  // my organized event
  displayMyEvents(): Observable<any> {
    var token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    console.log("token");
    console.log(token);
    return this.httpClient
      .get<any[]>(this.url + "/event/getMyEvents", { headers })
      .pipe(
        tap((data) => {
          console.log(data);
        }),
        catchError(this.handleError),
      );
  }

  // focus on UserEvent table and a specific event
  viewTicketDetails(eventID: any): Observable<any> {
    var token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .get<any[]>(this.url + "/event/getTicketDetails/" + eventID, {
        headers: headers,
      })
      .pipe(
        tap((data) => {
          console.log(data);
        }),
        catchError(this.handleError),
      );
  }

  purchaseTicket(eventData: {
    UserID: number;
    EventID: number;
    TicketType: string;
    PurchaseDate: Date;
  }): Observable<any> {
    var token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .post(this.url + "/userevent/purchase", eventData, { headers })
      .pipe(
        tap((response) => {
          console.log("Ticket purchase response:", response);
        }),
        catchError(this.handleError),
      );
  }

  submitSponsorship(sponsorData: {
    UserID: number;
    EventID: number;
    SponsorshipAmount: number;
  }): Observable<any> {
    var token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .post(this.url + "/eventsponsor", sponsorData, {
        headers: headers,
      })
      .pipe(
        tap((response) => {
          console.log("Sponsorship response:", response);
        }),
        catchError(this.handleError),
      );
  }

  updateEvent(eventId: any, eventData: any): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
  
    return this.httpClient
      .put(this.url + "/event/updateEvent/" + eventId, eventData, { headers })
      .pipe(
        tap((response) => {
          console.log("Event update response:", response);
        }),
        catchError(this.handleError)
      );
  }

  deleteEvent(eventId: any): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
  
    return this.httpClient.delete(`${this.url}/event/deleteEvent/${eventId}`, {
      headers,
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
