
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserdetailService {
  inputObj:any={};
  
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

    return this.inputObj;
  }
  saveData(input:any)
  {
    this.inputObj=input;
  }

  updateUserOnServer(id: any, userData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/users/${id}`, userData);
  }

  getUserIdByEmail(email: string): Observable<number | null> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.email === email);
        return user ? user.id : null;
      })
    );
  }
}
