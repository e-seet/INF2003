import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "http://localhost:3000/api";

  constructor(private httpClient: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/profile`);
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/profile`, userData);
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/profile/picture`, formData);
  }
}
