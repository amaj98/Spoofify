import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  
  songApiUrl: string = 'http://localhost:3000/api/song/';
  artistApiUrl: string = 'http://localhost:3000/api/artist/';
  albumApiUrl: string = 'http://localhost:3000/api/album/'
  userApiUrl: string = 'http://localhost:3000/api/user/'
  playlistApiUrl: string = 'http://localhost:3000/api/playlist/'
  songs : any[] = []
  song_names : string[] = []
  albums : any[] = []
  album_names : string[] = []
  artists : any[] = []
  artist_names : any[] = []
  playlists : any[] = []
  playlist_names : any[] = []
  feature_names : string[] = []

  constructor(private authService: AuthService, private http:HttpClient, private router: Router){}

  getData(){
    this.albums = []
    this.album_names = []
    this.artists = []
    this.artist_names = []
    this.songs = []
    this.song_names = []
    this.playlists = []
    this.playlist_names = []
    if (this.authService.currentUser){
      let userID : string = this.authService.currentUser.user._id
      this.http.get(this.userApiUrl+userID).subscribe(res =>{
        if(JSON.parse(JSON.stringify(res)).saved_songs.length != 0){ //check if user has songs
          for(let s of JSON.parse(JSON.stringify(res)).saved_songs){ //format songs to display titles
            this.formatSong(s) //get saved songs for user
          }
        }
        if (JSON.parse(JSON.stringify(res)).saved_albums.length != 0){ //check if user has albums
          for(let a of JSON.parse(JSON.stringify(res)).saved_albums){ //format albums to display titles
            this.formatAlbum(a) //get saved albums for user
          }
        }
        if (JSON.parse(JSON.stringify(res)).saved_artists.length != 0){ //check if user has artists
          for(let a of JSON.parse(JSON.stringify(res)).saved_artists){ //format artist to display titles
            this.formatArtist(a) //get saved artists for user
          }
        }
        if (JSON.parse(JSON.stringify(res)).saved_playlists.length != 0){ //check if user has playlist
          for(let p of JSON.parse(JSON.stringify(res)).saved_playlists){ //format playlsits to display titles
            this.formatPlaylist(p) //get saved playlsits for user
          }
        }
      })
    }
  }

  formatSong(song: string){
    return this.http.get(this.songApiUrl+song).subscribe(res =>{ //change song ID to song name
      //this.songs = this.song_names.concat(JSON.parse(JSON.stringify(res)))
      //this.song_names.push(JSON.parse(JSON.stringify(res)))
      //console.log(this.songs)
      let promise = Promise.resolve(this.pushSong(JSON.parse(JSON.stringify(res))))
      let s : any = JSON.parse(JSON.stringify(res))
        this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change artist ID to artist name
          console.log(this.songs.indexOf(s))
          //this.songs[this.songs.indexOf(s)].artist = JSON.parse(JSON.stringify(res))
          this.feature_names = []
        })
        this.http.get(this.albumApiUrl+s.album).subscribe(res =>{ //change album ID to album name
          //this.songs[this.songs.indexOf(s)].album = JSON.parse(JSON.stringify(res))
        })
        if(s.features.length != 0){ //check if songs has features
          for(let f of s.features){
            this.formatFeature(f, s)
          }
        }
        //this.songs[this.songs.indexOf(s)].duration = this.formatDuration(s.duration)
    })
  }

  formatAlbum(album: string){
    return this.http.get(this.albumApiUrl+album).subscribe(res =>{ //change album ID to album name
      let promise = Promise.resolve(this.pushAlbum(JSON.parse(JSON.stringify(res))))
    })
  }

  formatArtist(artist: string){
    return this.http.get(this.artistApiUrl+artist).subscribe(res =>{ //change artist ID to artist name
      let promise = Promise.resolve(this.pushArtist(JSON.parse(JSON.stringify(res))))
    })
  }

  formatPlaylist(playlist : string){
    return this.http.get(this.playlistApiUrl+playlist).subscribe(res =>{ //change playlist ID to playlist name
      let promise = Promise.resolve(this.pushPlaylist(JSON.parse(JSON.stringify(res))))
    })
  }

  pushSong(s : any){
    this.songs = this.song_names.concat(s)
    this.song_names.push(s)
    let promise = Promise.resolve(this.getSongArtist(s))
  }

  pushAlbum(a : any){
    this.albums = this.album_names.concat(a)
    this.album_names.push(a)
    let promise = Promise.resolve(this.getAlbumArtist(a))
  }

  pushArtist(a : any){
    this.artists = this.artist_names.concat(a)
    this.artist_names.push(a)
  }

  pushPlaylist(p : any){
    this.playlists = this.playlist_names.concat(p)
    this.playlist_names.push(p)
    let promise = Promise.resolve(this.getCreator(p))
  }

  getSongArtist(s : any){
    this.http.get(this.artistApiUrl+s.artist).subscribe(res =>{ //change artist ID to artist name
      this.songs[this.songs.indexOf(s)].artist = JSON.parse(JSON.stringify(res))
      let promise1 = Promise.resolve(this.getAlbum(s))
      this.feature_names = []
      let promise2 = Promise.resolve(this.getFeatures(s))
    })
  }

  getAlbumArtist(a : any){
    this.http.get(this.artistApiUrl+a.artist).subscribe(res =>{ //change artist ID to artist name
      this.albums[this.albums.indexOf(a)].artist = JSON.parse(JSON.stringify(res))
    })
  }

  getAlbum(s : any){
    this.http.get(this.albumApiUrl+s.album).subscribe(res =>{ //change album ID to album name
      this.songs[this.songs.indexOf(s)].album = JSON.parse(JSON.stringify(res))
      let promise = Promise.resolve(this.songs[this.songs.indexOf(s)].duration = this.formatDuration(s.duration))
    })
  }

  getFeatures(s : any){
    if(s.features.length != 0){ //check if songs has features
      for(let f of s.features){
        this.formatFeature(f, s)
      }
    }
  }

  getCreator(p : any){
    this.http.get(this.userApiUrl+p.creator).subscribe(res =>{ //change user ID to user name
      this.playlists[this.playlists.indexOf(p)].creator = JSON.parse(JSON.stringify(res)).user
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

  removeSong(s : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved songs for a user
      this.songs = JSON.parse(JSON.stringify(res)).saved_songs
      for( var i = 0; i < this.songs.length; i++){ //remove song from array
        if ( this.songs[i] === s) {
          this.songs.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved songs array for user
        "saved_songs": this.songs
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getData() //refresh to display changed buttons
      })
    })
  }

  removePlaylist(p : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved playlists for a user
      this.playlists = JSON.parse(JSON.stringify(res)).saved_playlists
      for( var i = 0; i < this.playlists.length; i++){ //remove playlist from array
        if ( this.playlists[i] === p) {
          this.playlists.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved playlists array for user
        "saved_playlists": this.playlists
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getData() //refresh to display changed buttons
      })
    })
  }

  removeArtist(a : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved artists for user
      this.artists = JSON.parse(JSON.stringify(res)).saved_artists
      for( var i = 0; i < this.artists.length; i++){ //remove artist from array
        if ( this.artists[i] === a) {
          this.artists.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved artists array for user
        "saved_artists": this.artists
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getData() //refresh to display changed buttons
      })
    })
  }

  removeAlbum(a : string){
    let userID : string = this.authService.currentUser.user._id
    this.http.get(this.userApiUrl+userID).subscribe(res =>{ //get saved albums for a user
      this.albums = JSON.parse(JSON.stringify(res)).saved_albums
      for( var i = 0; i < this.albums.length; i++){ //remove album from array
        if ( this.albums[i] === a) {
          this.albums.splice(i, 1); 
        }
     }
      return this.http.put(this.userApiUrl+userID, { //update saved albums array for user
        "saved_albums": this.albums
      }).subscribe(res => {
        console.log(JSON.parse(JSON.stringify(res)))
        this.getData() //refresh to display changed buttons
      })
    })
  }

  ngOnInit() {
    this.getData()
  }

  goPlaylist(p : string){
    this.router.navigate(['/playlist/' + p])
  }

  goLogin(){
    this.router.navigate(['/login'])
  }

}
