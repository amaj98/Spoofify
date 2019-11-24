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
  username: string
  
  constructor(private authService: AuthService, private router: Router){}

  register(email:string, password:string, username: string){
     return this.authService.register(email,password,username).subscribe(res=>{
      let user = JSON.parse(res);
      if(user.message) this.errmsg = user.message
      else this.router.navigate(['/'])});
  }

  onSubmit(buttonType): void {
    if(buttonType==="login") {
      this.router.navigate(['/login'])
    }
    if(buttonType==="register"){
        this.register(this.email,this.password,this.username)
    }
  }

  ngOnInit() {
  }

}
