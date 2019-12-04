import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class AlbumsComponent implements OnInit {
  
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  userApiUrl: string = 'http://localhost:3000/api/user/'
  albums : any[]
  savedAlbums : string[] = []
  artist_name = [];
  artists = [];

  artist:string;
  genre:string;
  title:string;

  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

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

  onSubmit() {
    let modal:HTMLFormElement = document.getElementById("songForm") as HTMLFormElement;
    console.log("sup");
    console.log(modal); 
    
     let json = {
       "title":this.title,
       "artist":this.artist,
       "genre":this.genre,
       "spotify":" "
     }
      console.log(json);   
      this.http.post(this.albumApiUrl, json).subscribe(res => {
        this.getAlbums()  
        console.log(JSON.parse(JSON.stringify(res)));
      });
    }

  getAlbums(){
    if (this.authService.currentUser){
      let userID : string = this.authService.currentUser.user._id
      this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved albums for user
        this.savedAlbums = JSON.parse(JSON.stringify(res)).saved_albums
        return this.http.get(this.albumApiUrl).subscribe(res =>{ //get all albums
          console.log(JSON.stringify(res))
          this.albums = JSON.parse(JSON.stringify(res))
          for (let a of this.albums){ //loop through all albums
            this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
              a.artist = JSON.parse(JSON.stringify(res))
            })
          }
        } );
      });
    }
    else{
      return this.http.get(this.albumApiUrl).subscribe(res =>{ //get all albums
        console.log(JSON.stringify(res))
        this.albums = JSON.parse(JSON.stringify(res))
        for (let a of this.albums){ //loop through all albums
          this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
            a.artist = JSON.parse(JSON.stringify(res))
          })
        }
      } );
    }
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
        this.getAlbums() //refresh to display changed buttons
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
        this.getAlbums() //refresh to display changed buttons
      })
    })
  }

  goAlbum(a : string){
    this.router.navigate(['/album/'+a])
  }

  goArtist(a : string){
    this.router.navigate(['/artist/'+a])
  }

  displayLogin(){
    if (window.confirm("You must be logged in to save an album. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  ngOnInit() {
    this.getArtists()
    this.getAlbums()
  }

}
