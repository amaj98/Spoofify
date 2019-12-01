import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class ArtistsComponent implements OnInit {
  
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  artists : any[]

  constructor(private router: Router, private http:HttpClient){}

  getArtists(){
    return this.http.get(this.artistApiUrl).subscribe(res =>{ //get all artists
      console.log(JSON.stringify(res))
      this.artists = JSON.parse(JSON.stringify(res))
      for (let a of this.artists){ //loop through all artists
        this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
          a.artist = JSON.parse(JSON.stringify(res)).name
        })
      }
      return this.artists;
    } );
  }

  ngOnInit() {
    this.getArtists()
  }

}
