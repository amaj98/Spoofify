import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = 'http://localhost:3000/api/user/';
  public user; 
  constructor(private http:HttpClient) { }

  public get currentUser(){return this.user;}
  
  login(email,password){
    return this.http.post(this.apiUrl+'login',{email,password}).pipe(map(res =>{
      this.user = res;
      localStorage.setItem('user',JSON.stringify(res));
      return JSON.stringify(res);
    } ));
  }
}
