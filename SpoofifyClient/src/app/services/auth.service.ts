import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = 'http://localhost:3000/api/user/' 
  constructor(private http:HttpClient) { }
  
  login(email,password){
    return this.http.post(this.apiUrl+'login',{email,password}).pipe(map(res => JSON.stringify(res)));
  }
}
