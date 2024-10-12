import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(public httpClient: HttpClient) {}
  private url = "http://localhost:3000";

  getCategory() {
    // console.log(token);
    // var decodedToken = this.getDecodedAccessToken(token);
    // console.log(decodedToken.userID)
    const headers = new HttpHeaders().set("content-type", "application/json");
    //   .set("Authorization", `Bearer ${token}`);

    return this.httpClient
      .get<any>(this.url + "/category/getcategories", { headers: headers })
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        catchError(this.handleError),
      );
  }

  // Handle HTTP errors
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
