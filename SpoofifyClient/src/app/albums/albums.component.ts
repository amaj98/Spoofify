import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
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

  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

  getAlbums(){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{
      this.savedAlbums = JSON.parse(JSON.stringify(res)).saved_albums
      this.http.get(this.albumApiUrl).subscribe(res =>{ //get all albums
        console.log(JSON.stringify(res))
        this.albums = JSON.parse(JSON.stringify(res))
        for (let a of this.albums){ //loop through all albums
          this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
            a.artist = JSON.parse(JSON.stringify(res)).name
          })
        }
        return this.albums;
      } );
    });
  }

  saveAlbum(a : string){     
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{
      this.savedAlbums = JSON.parse(JSON.stringify(res)).saved_albums
      this.savedAlbums.push(a)
      return this.http.put(this.userApiUrl+userID, {
        "saved_albums": this.savedAlbums
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getAlbums()
      })
    })
  }

  removeAlbum(a : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{
      this.savedAlbums = JSON.parse(JSON.stringify(res)).saved_albums
      for( var i = 0; i < this.savedAlbums.length; i++){ 
        if ( this.savedAlbums[i] === a) {
          this.savedAlbums.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, {
        "saved_albums": this.savedAlbums
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getAlbums()
      })
    })
  }

  displayLogin(){
    if (window.confirm("You must be logged in to save an album. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  ngOnInit() {
    this.getAlbums()
  }

}
