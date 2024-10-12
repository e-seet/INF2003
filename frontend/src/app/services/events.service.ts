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

  private url = "localhost:3000"; // Example API URL

  data: any[] = [];

  displayEvents(): Observable<any> {
    console.log(
      "calling services to get events data from the server & database",
    );
    return this.httpClient
      .get<any[]>("http://localhost:3000/event/getAllEvents")
      .pipe(
        tap((databack) => {
          // console.log(databack)
        }),
        catchError(this.handleError),
      );
  }

  getTickets(): Observable<any> {
    var token = this.loginService.getToken();
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .get<any[]>("http://localhost:3000/event/getTickets", { headers })
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

    console.log("create event in service");
    console.log(eventData);
    return this.httpClient
      .post<
        any[]
      >("http://localhost:3000/event/createEvent", eventData, { headers })
      .pipe(
        tap((databack) => {
          console.log(databack);
        }),
        catchError(this.handleError),
      );
  }

  viewEventDetails(eventID: any): Observable<any> {
    console.log(
      "calling services to get events data from the server & database",
    );
    return this.httpClient
      .get<any[]>("http://localhost:3000/event/getEvent/" + eventID)
      .pipe(
        tap((databack) => {
          console.log("received data back from service");
        }),
        catchError(this.handleError),
      );
  }

  displayVenue(): Observable<any> {
    console.log("service:");

    return this.httpClient.get<any[]>("http://localhost:3000/venues/").pipe(
      tap((databack) => {
        console.log(databack);
        // console.log(databack)
        console.log("end of service\n");
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
    return this.httpClient
      .post("http://localhost:3000/userevent/purchase", eventData)
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
    const headers = new HttpHeaders().set("content-type", "application/json");

    return this.httpClient
      .post("http://localhost:3000/eventsponsor", sponsorData, {
        headers: headers,
      })
      .pipe(
        tap((response) => {
          console.log("Sponsorship response:", response);
        }),
        catchError(this.handleError),
      );
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
