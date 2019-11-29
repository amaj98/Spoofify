import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class SongsComponent implements OnInit {
  
  songApiUrl: string = 'http://localhost:3000/api/song/';
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  songs : any[]

  constructor(private router: Router, private http:HttpClient){}

  getSongs(){
    return this.http.get(this.songApiUrl).subscribe(res =>{ //get all songs
      console.log(JSON.stringify(res))
      this.songs = JSON.parse(JSON.stringify(res))
      for (let s of this.songs){ //loop through all songs
        this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change artist ID to artist name
          s.artist = JSON.parse(JSON.stringify(res)).name
        })
        if(s.features.length != 0){ //check if songs has features
          for (let f of s.features){ //loop through all features
            let features_names: string[] = []
            this.http.get(this.artistApiUrl+f).subscribe(res =>{ //change feature ID to feature name
              features_names.push(JSON.parse(JSON.stringify(res)).name)
            })
            s.features = features_names
          }
        }
      }
      return this.songs;
    } );
  }

  goHome(){
    this.router.navigate(['/'])
  }

  ngOnInit() {
    this.getSongs()
  }

}
