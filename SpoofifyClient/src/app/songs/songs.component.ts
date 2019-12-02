import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { } from 'jquery'

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
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  userApiUrl: string = 'http://localhost:3000/api/user/'
  songs : any[]
  savedSongs : any[]

  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

  getSongs(){
    return this.http.get(this.songApiUrl).subscribe(res =>{ //get all songs
      this.songs = JSON.parse(JSON.stringify(res))
      for (let s of this.songs){ //loop through all songs
        this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change artist ID to artist name
          s.artist = JSON.parse(JSON.stringify(res)).name
        })
        this.http.get(this.albumApiUrl+s.album).subscribe(res =>{ //change album ID to album name
          s.album = JSON.parse(JSON.stringify(res)).title
        })
        if(s.features.length != 0){ //check if songs has features
          let features_names: string[] = []
          for(let f of s.features){
            features_names = this.formatFeature(f, s, features_names)
          }

        }
      }
      return this.songs;
    } );
  }

  formatFeature(feature: string, s: any, features_names: string[]){
    this.http.get(this.artistApiUrl+feature).subscribe(res =>{ //change feature ID to feature name
      features_names.push(JSON.parse(JSON.stringify(res)).name)
      s.features = features_names
    })
    return features_names
  }

  notLoggedIn(){
    if (window.confirm("You must be logged in to save a song. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  saveSong(s : string){     
    let userID : string = this.authService.currentUser.user._id
    let currentSaved : string[] = []
    this.http.get(this.userApiUrl+userID).subscribe(res =>{
      currentSaved = JSON.parse(JSON.stringify(res)).saved_songs
      currentSaved.push(s)
      return this.http.put(this.userApiUrl+userID, {
        "saved_songs": currentSaved
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
      })
    })
    
  }

  ngOnInit() {
    this.getSongs()
  }

}
