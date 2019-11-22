import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {

  logininfo: string = 'this is logininfo';
  email: string;
  password: string;
  
  constructor(private authService: AuthService){}

  login(email:string, password:string){
     return this.authService.login(email,password).subscribe(user=>this.logininfo = user);
  }

  onSubmit(){
    this.login(this.email,this.password);
  }
  ngOnInit() {
  }

}
