import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = 'http://localhost:3000/api/user/';
  public user; 
  constructor(private http:HttpClient) {
    this.user = JSON.parse(localStorage.getItem('user'));
   }

  public get currentUser(){return this.user;}
  
  login(email,password){
    return this.http.post(this.apiUrl+'login',{email,password}).pipe(map(res =>{
      if (!JSON.parse(JSON.stringify(res)).message){
        localStorage.setItem('user',JSON.stringify(res));
        this.user = res;
      }
      return JSON.stringify(res);
    } ));
  }

  register(email,password,user){
    console.log(email,password,user);
    return this.http.post(this.apiUrl,{email,password,user}).pipe(map(res =>{
      this.user = res;
      return JSON.stringify(res);
    } ));
  }
}
