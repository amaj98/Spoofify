import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class AlbumComponent implements OnInit {
  
  userApiUrl: string = 'http://localhost:3000/api/user/'
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  songApiUrl: string = 'http://localhost:3000/api/song/'
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  songs : any[]
  savedSongs : string[] = []
  savedAlbums : string[] = []
  album: string

  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

  getSongs(){
    let album_id : string = this.router.url.split('/')[2]
    this.http.get(this.albumApiUrl+album_id).subscribe(res =>{ //change album ID to album name
      this.album = JSON.parse(JSON.stringify(res))
      if (this.authService.currentUser){
        let userID : string = this.authService.currentUser.user._id
        this.http.get(this.userApiUrl+userID).subscribe(res =>{
          this.savedSongs = JSON.parse(JSON.stringify(res)).saved_songs //get saved songs for a user
          this.savedAlbums = JSON.parse(JSON.stringify(res)).saved_albums //get saved albums for a user
          return this.http.get(this.songApiUrl+"/album/"+album_id).subscribe(res =>{ //get all albums songs
            this.songs = JSON.parse(JSON.stringify(res))
            for (let s of this.songs){ //loop through all songs
              this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change album ID to album name
                s.artist = JSON.parse(JSON.stringify(res))
              })
              s.duration = this.formatDuration(s.duration)
            }
          } );
        });
      }
      else{
        return this.http.get(this.songApiUrl+"/album/"+album_id).subscribe(res =>{ //get all albums songs
          this.songs = JSON.parse(JSON.stringify(res))
          for (let s of this.songs){ //loop through all songs
            this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change album ID to album name
              s.artist = JSON.parse(JSON.stringify(res))
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

  saveAlbum(a : string){     
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved albums for user
      this.savedAlbums = JSON.parse(JSON.stringify(res)).saved_albums
      this.savedAlbums.push(a) //add album to array
      return this.http.put(this.userApiUrl+userID, { //update saved albums array for user
        "saved_albums": this.savedAlbums
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getSongs() //refresh to display changed buttons
      })
    })
  }

  removeAlbum(a : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved albums for a user
      this.savedAlbums = JSON.parse(JSON.stringify(res)).saved_albums
      for( var i = 0; i < this.savedAlbums.length; i++){ //remove album from array
        if ( this.savedAlbums[i] === a) {
          this.savedAlbums.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved albums array for user
        "saved_albums": this.savedAlbums
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

  goArtist(a : string){
    this.router.navigate(['/artist/'+a])
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
