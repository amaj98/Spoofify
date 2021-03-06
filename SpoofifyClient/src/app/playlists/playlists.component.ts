import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class PlaylistsComponent implements OnInit {
  
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  userApiUrl: string = 'http://localhost:3000/api/user/'
  playlistApiUrl : string = 'http://localhost:3000/api/playlist/'
  songApiUrl: string = 'http://localhost:3000/api/song/';
  playlists : any[]
  savedPlaylists : string[] = []
  songs= []

  title: string;
  songs_: string[] = [];

  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

  getSongs() {
    this.http.get(this.songApiUrl).subscribe(res => {
      let json = JSON.parse(JSON.stringify(res));
      for(let song of json) {
        this.songs.push([song.title,song._id])
      }
    });
  }

  onSubmit() {
    let json = {
      "title":this.title,
      "songs":this.songs_,
      "followers":0,
      "creator":this.authService.currentUser.user._id
    }
     
     this.http.post(this.playlistApiUrl, json).subscribe(res => {
         console.log(JSON.parse(JSON.stringify(res)));
         this.getPlaylists();
     });
   }

  getPlaylists(){
    if (this.authService.currentUser){
      let userID : string = this.authService.currentUser.user._id
      this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved playlists for user
        this.savedPlaylists = JSON.parse(JSON.stringify(res)).saved_playlists
        return this.http.get(this.playlistApiUrl).subscribe(res =>{ //get all playlists
          console.log(JSON.stringify(res))
          this.playlists = JSON.parse(JSON.stringify(res))
          for (let p of this.playlists){ //loop through all playlists
            this.http.get(this.userApiUrl+p.creator).subscribe(res =>{ //change user ID to artist user
              p.creator = JSON.parse(JSON.stringify(res)).user
            })
          }
        } );
      });
    }
    else{
      return this.http.get(this.playlistApiUrl).subscribe(res =>{ //get all playlists
        console.log(JSON.stringify(res))
        this.playlists = JSON.parse(JSON.stringify(res))
        for (let p of this.playlists){ //loop through all playlists
          this.http.get(this.userApiUrl+p.creator).subscribe(res =>{ //change user ID to user name
            p.creator = JSON.parse(JSON.stringify(res)).user
          })
        }
      } );
    }
  }

  savePlaylist(p : string, followers : number){     
    let userID : string = this.authService.currentUser.user._id
    this.http.put(this.playlistApiUrl+p,{
      "followers": followers+1
    }).subscribe(res =>{
      this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved playlists for user
        this.savedPlaylists = JSON.parse(JSON.stringify(res)).saved_playlists
        this.savedPlaylists.push(p) //add playlist to array
        return this.http.put(this.userApiUrl+userID, { //update saved playlists array for user
          "saved_playlists": this.savedPlaylists
        }).subscribe(res => {
          console.log(JSON.parse(JSON.stringify(res)))
          this.getPlaylists() //refresh to display changed buttons
        })
      })
    })
  }

  removePlaylist(p : string, followers : number){
    let userID : string = this.authService.currentUser.user._id
    this.http.put(this.playlistApiUrl+p,{
      "followers": followers-1
    }).subscribe(res =>{
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
          this.getPlaylists() //refresh to display changed buttons
        })
      })
    })
  }

  displayLogin(){
    if (window.confirm("You must be logged in to save an album. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  goPlaylist(p : string){
    this.router.navigate(['/playlist/' + p])
  }

  ngOnInit() {
    this.getSongs()
    this.getPlaylists()
  }

}
