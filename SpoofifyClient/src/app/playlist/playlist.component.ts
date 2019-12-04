import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class PlaylistComponent implements OnInit {
  
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  userApiUrl: string = 'http://localhost:3000/api/user/'
  playlistApiUrl : string = 'http://localhost:3000/api/playlist/'
  songApiUrl : string = 'http://localhost:3000/api/song/'
  playlist : any
  savedPlaylists : string[] = []
  song_names: string[] = []
  current_user : string


  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

  getPlaylist(refresh : boolean){
    if (this.authService.currentUser){
      let userID : string = this.authService.currentUser.user._id
      this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved playlists for user
        this.savedPlaylists = JSON.parse(JSON.stringify(res)).saved_playlists
        let playlist_id : string = this.router.url.split('/')[2]
        return this.http.get(this.playlistApiUrl+playlist_id).subscribe(res =>{ //get playlist
          console.log(JSON.stringify(res))
          this.playlist = JSON.parse(JSON.stringify(res))
          this.http.get(this.userApiUrl+this.playlist.creator).subscribe(res =>{ //change user ID to user name
            this.current_user = this.playlist.creator
            this.playlist.creator = JSON.parse(JSON.stringify(res)).user
            if(this.playlist.songs.length != 0 && !refresh){ //check if playlist has songs
              for(let s of this.playlist.songs){ //format songs to display titles
                this.formatSong(s)
              }
            }
            else{ //if refreshing, dont re-fetch song titles
              this.playlist.songs = this.song_names
            }
          })
        });
      });
    }
    else{
      let playlist_id : string = this.router.url.split('/')[2]
        return this.http.get(this.playlistApiUrl+playlist_id).subscribe(res =>{ //get playlist
          console.log(JSON.stringify(res))
          this.playlist = JSON.parse(JSON.stringify(res))
          this.http.get(this.userApiUrl+this.playlist.creator).subscribe(res =>{ //change user ID to user name
            this.current_user = this.playlist.creator
            this.playlist.creator = JSON.parse(JSON.stringify(res)).user
            if(this.playlist.songs.length != 0 && !refresh){ //check if playlist has songs
              for(let s of this.playlist.songs){ //format songs to display titles
                this.formatSong(s)
              }
            }
            else{ //if refreshing, dont re-fetch song titles
              this.playlist.songs = this.song_names
            }
          })
        });
    }
  }

  formatSong(song: string){
    return this.http.get(this.songApiUrl+song).subscribe(res =>{ //change song ID to song name
      this.playlist.songs = this.song_names.concat(JSON.parse(JSON.stringify(res)))
      this.song_names.push(JSON.parse(JSON.stringify(res)))
    })
  }

  savePlaylist(p : string){     
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved playlists for user
      this.savedPlaylists = JSON.parse(JSON.stringify(res)).saved_playlists
      this.savedPlaylists.push(p) //add playlist to array
      return this.http.put(this.userApiUrl+userID, { //update saved playlists array for user
        "saved_playlists": this.savedPlaylists
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getPlaylist(true) //refresh to display changed buttons
      })
    })
  }

  removePlaylist(p : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved playlists for a user
      this.savedPlaylists = JSON.parse(JSON.stringify(res)).saved_playlists
      for( var i = 0; i < this.savedPlaylists.length; i++){ //remove playlist from array
        if ( this.savedPlaylists[i] === p) {
          this.savedPlaylists.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved playlists array for user
        "saved_playlists": this.savedPlaylists
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getPlaylist(true) //refresh to display changed buttons
      })
    })
  }

  displayLogin(){
    if (window.confirm("You must be logged in to save an album. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  ngOnInit() {
    this.getPlaylist(false)
  }

}
