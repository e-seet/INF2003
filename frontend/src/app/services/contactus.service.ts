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
export class ContactusService {
  constructor(
    public httpClient: HttpClient,
    private loginService: LoginService,
  ) {}
  private url = "http://localhost:3000"; // Example API URL

  submitContactUs(data: any): Observable<any> {
    var token = this.loginService.getToken();
    const headers = new HttpHeaders().set("content-type", "application/json");
    //   .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .post<any[]>(this.url + "/mongo/contact", data, { headers })
      .pipe(
        tap((databack) => {
          console.log(databack);
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

  //   this.http.post("/api/contact", this.contactForm.value).subscribe({
  // 	next: () => {
  // 	  this.successMessage = "Your message has been sent successfully.";
  // 	  this.contactForm.reset();
  // 	},
  // 	error: () => {
  // 	  this.errorMessage =
  // 		"There was an error sending your message. Please try again.";
  // 	},
  //   });
}
