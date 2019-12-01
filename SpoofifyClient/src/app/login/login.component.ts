import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {

  errmsg: string;
  email: string;
  password: string;
  
  constructor(private authService: AuthService, private router: Router){}

  login(){
     this.authService.login(this.email,this.password).subscribe(res=>{
      //let user = JSON.parse(res);
      if(JSON.parse(res).message){
        this.errmsg = JSON.parse(res).message
      } 
      else {
        let user = JSON.parse(res)
        this.router.navigate(['/'])
      }});
      console.log(localStorage.getItem('user'))
  }

  goRegister(){
    this.router.navigate(['/register'])
  }
  ngOnInit() {

  }

}
