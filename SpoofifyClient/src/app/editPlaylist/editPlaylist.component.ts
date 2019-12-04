import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jq from 'jquery';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-editPlaylist',
  templateUrl: './editPlaylist.component.html',
  styleUrls: ['./editPlaylist.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class EditPlaylistComponent implements OnInit {
  
  songApiUrl: string = 'http://localhost:3000/api/song/';
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  userApiUrl: string = 'http://localhost:3000/api/user/'
  playlistApiUrl: string = 'http://localhost:3000/api/playlist/'
  songs : any[]
  artists : any[]
  albums: any[]
  playlist: any
  savedSongs : string[] = []
  feature_names : string[] = []

  constructor(
    private router: Router,
    private http:HttpClient,
    private authService: AuthService
  ){ }

  getSongs(){
    let playlist_id : string = this.router.url.split('/')[2]
      this.http.get(this.playlistApiUrl+playlist_id).subscribe(res =>{
        this.playlist = JSON.parse(JSON.stringify(res))
        this.http.get(this.playlistApiUrl+playlist_id).subscribe(res =>{
          this.savedSongs = JSON.parse(JSON.stringify(res)).songs //get saved songs for a playlist
          return this.http.get(this.songApiUrl).subscribe(res =>{ //get all songs
            this.songs = JSON.parse(JSON.stringify(res))
            this.http.get(this.artistApiUrl).subscribe(res => {
              this.artists = JSON.parse(JSON.stringify(res))
            })
            this.http.get(this.albumApiUrl).subscribe(res =>{
              this.albums = JSON.parse(JSON.stringify(res))
            })
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
    })
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
    let playlist_id : string = this.router.url.split('/')[2]
    this.http.get(this.playlistApiUrl+playlist_id).subscribe(res =>{ //get saved songs for a playlist
      this.savedSongs = JSON.parse(JSON.stringify(res)).songs
      this.savedSongs.push(s) //add song to array
      return this.http.put(this.playlistApiUrl+playlist_id, { //update saved songs array for user
        "songs": this.savedSongs
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getSongs() //refresh to display changed buttons
      })
    })
  }

  removeSong(s : string){
    let playlist_id : string = this.router.url.split('/')[2]
    this.http.get(this.playlistApiUrl+playlist_id).subscribe(res =>{ //get saved songs for a user
      this.savedSongs = JSON.parse(JSON.stringify(res)).songs
      for( var i = 0; i < this.savedSongs.length; i++){ //remove song from array
        if ( this.savedSongs[i] === s) {
          this.savedSongs.splice(i, 1); 
        }
     }
      return this.http.put(this.playlistApiUrl+playlist_id, { //update saved songs array for user
        "songs": this.savedSongs
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
    this.getSongs()
  }

}
