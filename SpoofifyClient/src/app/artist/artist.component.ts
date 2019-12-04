import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class ArtistComponent implements OnInit {
  
  userApiUrl: string = 'http://localhost:3000/api/user/'
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  songApiUrl: string = 'http://localhost:3000/api/song/'
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  songs : any[]
  savedSongs : string[] = []
  savedArtists : string[] = []
  artist: string

  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

  getSongs(){
    let artist_id : string = this.router.url.split('/')[2]
    this.http.get(this.artistApiUrl+artist_id).subscribe(res =>{ //change artist ID to artist name
      this.artist = JSON.parse(JSON.stringify(res))
      if (this.authService.currentUser){
        let userID : string = this.authService.currentUser.user._id
        this.http.get(this.userApiUrl+userID).subscribe(res =>{
          this.savedSongs = JSON.parse(JSON.stringify(res)).saved_songs //get saved songs for a user
          this.savedArtists = JSON.parse(JSON.stringify(res)).saved_artists //get saved artists for a user
          return this.http.get(this.songApiUrl+"/artist/"+artist_id).subscribe(res =>{ //get all artists songs
            this.songs = JSON.parse(JSON.stringify(res))
            for (let s of this.songs){ //loop through all songs
              this.http.get(this.albumApiUrl+s.album).subscribe(res =>{ //change album ID to album name
                s.album = JSON.parse(JSON.stringify(res))
              })
              s.duration = this.formatDuration(s.duration)
            }
          } );
        });
      }
      else{
        return this.http.get(this.songApiUrl+"/artist/"+artist_id).subscribe(res =>{ //get all artists songs
          this.songs = JSON.parse(JSON.stringify(res))
          for (let s of this.songs){ //loop through all songs
            this.http.get(this.albumApiUrl+s.album).subscribe(res =>{ //change album ID to album name
              s.album = JSON.parse(JSON.stringify(res))
            })
            s.duration = this.formatDuration(s.duration)
          }
        } );
      }
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

  saveArtist(a : string){     
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved artists for user
      this.savedArtists = JSON.parse(JSON.stringify(res)).saved_artists
      this.savedArtists.push(a) //add saved artist to array
      return this.http.put(this.userApiUrl+userID, { //update saved artists array for user
        "saved_artists": this.savedArtists
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getSongs() //refresh to display changed buttons
      })
    })
  }

  removeArtist(a : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved artists for user
      this.savedArtists = JSON.parse(JSON.stringify(res)).saved_artists
      for( var i = 0; i < this.savedArtists.length; i++){ //remove artist from array
        if ( this.savedArtists[i] === a) {
          this.savedArtists.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved artists array for user
        "saved_artists": this.savedArtists
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getSongs() //refresh to display changed buttons
      })
    })
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

  addListen(s : string, plays : number){
    this.http.put(this.songApiUrl+s, { //update saved songs array for user
      "plays": plays + 1
    }).subscribe(res => {
      console.log(JSON.parse(JSON.stringify(res)))
      this.getSongs() //refresh to display changed buttons
    })
  }

  goAlbum(a : string){
    this.router.navigate(['/album/'+a])
  }

  displayLogin(){
    if (window.confirm("You must be logged in to save an artist. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  ngOnInit() {
    this.getSongs()
  }

}
