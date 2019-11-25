import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  errmsg: string;
  email: string;
  password: string;
  passconf: string;
  username: string;


  constructor(private authService: AuthService, private router: Router){}

  ngOnInit() {
  }

  register(){
    if(this.password == this.passconf){
      this.authService.register(this.email,this.password,this.username).subscribe(res=>{
        let user = JSON.parse(res);
        if(user.message) this.errmsg = user.message
        else this.router.navigate(['/'])});
    }
    else this.errmsg = "Passwords do not match";
  }

}
