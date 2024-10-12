import { Injectable, EventEmitter, EmbeddedViewRef } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
// Import the jwt-decode function
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private TOKEN_KEY = 'authToken'; // Key for storing JWT token in localStorage
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn()); // BehaviorSubject to track login status

  private url = 'http://localhost:3000'; 

  constructor(public httpClient: HttpClient) {}

  // Observable to broadcast the login status
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Method to register a user
  registerUser(userData: any): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient
      .post<any[]>(`${this.url}/user/register`, userData, { headers: headers })
      .pipe(
        tap((response) => {
          console.log('User registered successfully', response);
        }),
        catchError(this.handleError)
      );
  }

  // Method to log in a user and store JWT token
  loginUser(userCredentials: any): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.httpClient
      .post<any>(`${this.url}/user/login`, userCredentials, { headers: headers })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            // Store the token in localStorage
            localStorage.setItem(this.TOKEN_KEY, response.token);
            console.log('Login successful, token stored!');
            this.loggedIn.next(true); // Notify subscribers that the user is logged in
          }
        }),
        catchError(this.handleError)
      );
  }

  getDecodedAccessToken(token: any): any {
	console.log("decode access token\n");
	try {
		// console.log(jwtDecode(token));
		var decodedToken = jwtDecode(token);
		return decodedToken;
	} catch (Error) {
	  return null;
	}
  }

  // return the profile details of a particualr user based by the userID
  getProfile()
  {
	console.log("get profile. Get JWT")
	var token = localStorage.getItem(this.TOKEN_KEY);
	// console.log(token);
	// var decodedToken = this.getDecodedAccessToken(token);
	// console.log(decodedToken.userID)
    const headers = new HttpHeaders()
			.set('content-type', 'application/json')
			.set('Authorization', `Bearer ${token}`);

	console.log("gotten token", token);
	
	return this.httpClient
      .get<any>(`${this.url}/user/profile`, { headers: headers })
      .pipe(
        tap((response) => {
			// console.log(response);
		}),
        catchError(this.handleError)
      );

  }

  // Method to log out the user and remove the token from localStorage
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('User logged out and token removed from storage.');
    this.loggedIn.next(false); // Notify subscribers that the user is logged out
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
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