import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jq from 'jquery';
import * as bootstrap from 'bootstrap';

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
  savedSongs : string[] = []
  feature_names : string[] = []
  artists = []
  artist_name = []
  albums = []
  album_names = []

  title: string;
  album: string;
  artist: string;
  features: string[] = [];
  duration: number;

  constructor(
    private router: Router,
    private http:HttpClient,
    private authService: AuthService
  ){ }

 onSubmit() {
  let modal:HTMLFormElement = document.getElementById("songForm") as HTMLFormElement;
  console.log("sup");
  console.log(modal); 
  
   let json = {
     "title":this.title,
     "album":this.album,
     "artist":this.artist,
     "features":this.features,
     "duration":this.duration,
     "spotify":"",
     "plays":0
   }
    console.log(json);   
    this.http.post(this.songApiUrl, json).subscribe(res => {
      this.getSongs()  
      console.log(JSON.parse(JSON.stringify(res)));
    });
  }

  getArtists() {
    this.http.get(this.artistApiUrl).subscribe(res => {
      let json = JSON.parse(JSON.stringify(res));
      for(let art of json) {
        if(this.artist_name.indexOf(art.name) < 0) {
          this.artists.push([art.name,art._id]);
          this.artist_name.push(art.name);
        }
      }
    });
  }

  getAlbum() {
    this.http.get(this.albumApiUrl).subscribe(res => {
      let json = JSON.parse(JSON.stringify(res));
      for(let alb of json) {
        if(this.album_names.indexOf(alb.name) < 0) {
          this.albums.push([alb.name,alb._id]);
          this.album_names.push(alb.name);
        }
      }
    });
  }

  getSongs(){
    if (this.authService.currentUser){
      let userID : string = this.authService.currentUser.user._id
      this.http.get(this.userApiUrl+userID).subscribe(res =>{
        this.savedSongs = JSON.parse(JSON.stringify(res)).saved_songs //get saved songs for a user
        return this.http.get(this.songApiUrl).subscribe(res =>{ //get all songs
          this.songs = JSON.parse(JSON.stringify(res))
          for (let s of this.songs){ //loop through all songs
            this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change artist ID to artist name
              s.artist = JSON.parse(JSON.stringify(res))
              this.feature_names = []
            })
            this.http.get(this.albumApiUrl+s.album).subscribe(res =>{ //change album ID to album name
              s.album = JSON.parse(JSON.stringify(res))
            })
            if(s.features.length != 0){ //check if songs has features
              for(let f of s.features){
                this.formatFeature(f, s)
              }
            }
            s.duration = this.formatDuration(s.duration)
          }
        } );
      });
    }
    else{
      return this.http.get(this.songApiUrl).subscribe(res =>{ //get all songs
        this.songs = JSON.parse(JSON.stringify(res))
        for (let s of this.songs){ //loop through all songs
          this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change artist ID to artist name
            s.artist = JSON.parse(JSON.stringify(res))
            this.feature_names = []
          })
          this.http.get(this.albumApiUrl+s.album).subscribe(res =>{ //change album ID to album name
            s.album = JSON.parse(JSON.stringify(res))
          })
          if(s.features.length != 0){ //check if songs has features
            for(let f of s.features){
              this.formatFeature(f, s)
            }
          }
          s.duration = this.formatDuration(s.duration)
        }
      } );
    }
   
  }

  formatFeature(feature: string, song : any){
    return this.http.get(this.artistApiUrl+feature).subscribe(res =>{ //change feature ID to feature name
      song.features = this.feature_names.concat(JSON.parse(JSON.stringify(res)))
      this.feature_names.push(JSON.parse(JSON.stringify(res)))
    })
  }

  formatDuration(d : number){
    let hours : number = Math.trunc(d / 60)
    d = d % 60
    let minutes : number = d
    let duration : string
    if (minutes < 10){
      duration = hours + ":0" + minutes
    }
    else{
      duration = hours + ":" + minutes
    }
    
    return duration
  }

  saveSong(s : string){     
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved songs for a user
      this.savedSongs = JSON.parse(JSON.stringify(res)).saved_songs
      this.savedSongs.push(s) //add song to array
      return this.http.put(this.userApiUrl+userID, { //update saved songs array for user
        "saved_songs": this.savedSongs
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getSongs() //refresh to display changed buttons
      })
    })
  }

  removeSong(s : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved songs for a user
      this.savedSongs = JSON.parse(JSON.stringify(res)).saved_songs
      for( var i = 0; i < this.savedSongs.length; i++){ //remove song from array
        if ( this.savedSongs[i] === s) {
          this.savedSongs.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved songs array for user
        "saved_songs": this.savedSongs
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getSongs() //refresh to display changed buttons
      })
    })
  }

  goAlbum(a : string){
    this.router.navigate(['/album/'+a])
  }

  goArtist(a : string){
    this.router.navigate(['/artist/'+a])
  }

  addListen(s : string, plays : number){
    this.http.put(this.songApiUrl+s, { //update saved songs array for user
      "plays": plays + 1
    }).subscribe(res => {
      console.log(JSON.parse(JSON.stringify(res)))
      this.getSongs() //refresh to display changed buttons
    })
  }

  displayLogin(){
    if (window.confirm("You must be logged in to save a song. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  ngOnInit() {
    this.getArtists();
    this.getSongs();
    this.getAlbum();
  }

}
