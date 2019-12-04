import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class ArtistsComponent implements OnInit {
  
  userApiUrl: string = 'http://localhost:3000/api/user/'
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  artists : any[]
  savedArtists : string[] = []

  name: string;
  summary: string;

  constructor(private router: Router, private http:HttpClient, private authService: AuthService){}

  onSubmit() {
    let json = {
      "name":this.name,
      "summary":this.summary,
      "followers":0
    }
     this.http.get(this.artistApiUrl)
     
     this.http.post(this.artistApiUrl, json).subscribe(res => {
         console.log(JSON.parse(JSON.stringify(res)));
     });
   }

  getArtists(){
    if (this.authService.currentUser){
      let userID : string = this.authService.currentUser.user._id
      this.http.get(this.userApiUrl+userID).subscribe(res =>{
        this.savedArtists = JSON.parse(JSON.stringify(res)).saved_artists
        return this.http.get(this.artistApiUrl).subscribe(res =>{ //get all artists
          console.log(JSON.stringify(res))
          this.artists = JSON.parse(JSON.stringify(res))
          for (let a of this.artists){ //loop through all artists
            this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
              a.artist = JSON.parse(JSON.stringify(res)).name
            })
          }
        });
      });
    }
    else{
      return this.http.get(this.artistApiUrl).subscribe(res =>{ //get all artists
        console.log(JSON.stringify(res))
        this.artists = JSON.parse(JSON.stringify(res))
        for (let a of this.artists){ //loop through all artists
          this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
            a.artist = JSON.parse(JSON.stringify(res)).name
          })
        }
      });
    }
  }

  saveArtist(a : string, followers : number){     
    let userID : string = this.authService.currentUser.user._id
    this.http.put(this.artistApiUrl+a,{
      "followers": followers+1
    }).subscribe(res =>{
      this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved artists for user
        this.savedArtists = JSON.parse(JSON.stringify(res)).saved_artists
        this.savedArtists.push(a) //add saved artist to array
        return this.http.put(this.userApiUrl+userID, { //update saved artists array for user
          "saved_artists": this.savedArtists
        }).subscribe(res => {
          console.log(JSON.parse(JSON.stringify(res)))
          this.getArtists() //refresh to display changed buttons
        })
      })
    })
  }

  removeArtist(a : string, followers : number){
    let userID : string = this.authService.currentUser.user._id
    this.http.put(this.artistApiUrl+a,{
      "followers": followers-1
    }).subscribe(res =>{
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
          this.getArtists() //refresh to display changed buttons
        })
      })
    })
  }

  

  displayLogin(){
    if (window.confirm("You must be logged in to save an artist. Press OK to login/register.")){
      this.router.navigate(['/login'])
    }
  }

  goArtist(a : string){
    this.router.navigate(['/artist/' + a])
  }

  ngOnInit() {
    this.getArtists()
  }

}
