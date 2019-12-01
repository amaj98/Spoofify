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
  albums : any[]

  constructor(private router: Router, private http:HttpClient){}

  getAlbums(){
    return this.http.get(this.albumApiUrl).subscribe(res =>{ //get all albums
      console.log(JSON.stringify(res))
      this.albums = JSON.parse(JSON.stringify(res))
      for (let a of this.albums){ //loop through all albums
        this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
          a.artist = JSON.parse(JSON.stringify(res)).name
        })
      }
      return this.albums;
    } );
  }

  ngOnInit() {
    this.getAlbums()
  }

}
