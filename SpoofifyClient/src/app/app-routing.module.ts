import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { SongsComponent } from './songs/songs.component';
import { AlbumsComponent } from './albums/albums.component';
import { ArtistsComponent } from './artists/artists.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent} from './playlist/playlist.component'

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', component: HomeComponent},
  {path: 'songs', component: SongsComponent},
  {path: 'albums', component: AlbumsComponent},
  {path: 'artists', component: ArtistsComponent},
  {path: 'playlists', component: PlaylistsComponent},
  {path: 'playlist/:id', component: PlaylistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
