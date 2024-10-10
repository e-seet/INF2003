import { Injectable, EventEmitter, EmbeddedViewRef } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(public httpClient: HttpClient) {}

  private url = 'localhost:3000/'; // Example API URL
  data: any[] = [];

  // Existing registerUser method
  registerUser(theVariable: any): Observable<any> {
    console.log('login service: register user');

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.httpClient
      .post<any[]>('http://localhost:3000/user/register', theVariable, {
        headers: headers,
      })
      .pipe(
        tap((databack) => {
          console.log('received data back from service');
          console.log(databack);
        }),
        catchError(this.handleError)
      );
  }

  // New loginUser method
  loginUser(userCredentials: any): Observable<any> {
    console.log('login service: login user');

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.httpClient
      .post<any>('http://localhost:3000/user/login', userCredentials, {
        headers: headers,
      })
      .pipe(
        tap((response) => {
          console.log('Login successful!');
          console.log(response);
        }),
        catchError(this.handleError)
      );
  }
  // viewEventDetails(eventID:any):Observable<any>
  // {
  //   console.log("calling services to get events data from the server & database")
  //   return this.httpClient.get<any[]>("http://localhost:3000/event/getEvent/" + eventID)
  //   .pipe(
  // 	  tap(databack => {
  // 		  console.log("received data back from service");
  // 	  }),
  // 	  catchError(this.handleError)
  // 	  )
  // }

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
