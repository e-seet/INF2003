import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(public httpClient: HttpClient) { }
  
  private url = 'localhost:3000/';  // Example API URL
  data: any[] = [];

  displayEvents():Observable<any>
  {
	console.log("calling services to get events data from the server & database")
    return this.httpClient.get<any[]>("http://localhost:3000/event/getAllEvents")
	.pipe(
		tap(databack => {
			// console.log(databack)
		}),
		catchError(this.handleError)
		)
  }
  
  viewEventDetails(eventID:any):Observable<any>
  {
	console.log("calling services to get events data from the server & database")
    return this.httpClient.get<any[]>("http://localhost:3000/event/getEvent/" + eventID)
	.pipe(
		tap(databack => {
			console.log("received data back from service");
		}),
		catchError(this.handleError)
		)
  }
  

  displayVenue(): Observable<any>
  {
	console.log("service:");

    return this.httpClient.get<any[]>("http://localhost:3000/venues/")
	.pipe(
        tap(databack => {
          console.log(databack)
			// console.log(databack)
		  console.log("end of service\n");
        }),
        catchError(this.handleError)
      )
  }
//   private handleError(res: HttpErrorResponse) {
//     console.error(res);
//     return throwError(res.error || 'Server error');
//   }
private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
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