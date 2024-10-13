import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { LoginService } from "./login.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService,
  ) {}

  getUserProfile(): Observable<any> {
    var token = this.loginService.getToken();

    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .get(`${this.apiUrl}/user/profile/organization`, { headers: headers })
      .pipe(
        tap((response) => {
          //   console.log(response);
        }),
        catchError(this.handleError),
      );
  }

  //   updateUserProfile(userData: any): Observable<any> {
  //     return this.httpClient.put(`${this.apiUrl}/profile`, userData);
  //   }

  //   uploadProfilePicture(formData: FormData): Observable<any> {
  //     return this.httpClient.post(`${this.apiUrl}/profile/picture`, formData);
  //   }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
