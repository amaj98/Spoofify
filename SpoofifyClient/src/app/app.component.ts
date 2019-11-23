import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Spoofify';
  user;

  constructor(private router: Router,private authService: AuthService){
    if(!this.authService.currentUser) this.router.navigate(['/login']);
  }
}

