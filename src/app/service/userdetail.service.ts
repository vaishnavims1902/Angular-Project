
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserdetailService {
  list:any[]=[];
  
  private apiUrl = 'http://localhost:3000/users/';

  constructor(private http: HttpClient) {}

  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }
  getItem(email: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+email);
  }
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.apiUrl, formData);
  }
  getData()
  {

    return this.list;
  }
  saveData(input:any)
  {
    this.list.push(input);
  }

  updateUserOnServer(email: any, userData: any): Observable<any> {
    return this.http.put<any>(this.apiUrl+email, userData);
  }
}
