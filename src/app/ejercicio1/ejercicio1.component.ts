import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MovieService } from '../services/movie.service';
import { MatTableDataSource, MatPaginator, MatTable, MatSnackBar } from '@angular/material';
import { Search } from '../interfaces/ISearch';
import { IMovie } from '../interfaces/IMovie';

@Component({
  selector: 'app-ejercicio1',
  templateUrl: './ejercicio1.component.html',
  styleUrls: ['./ejercicio1.component.css']
})
export class Ejercicio1Component implements OnInit {
  @ViewChild('moviesPaginator',{static:true}) moviesPaginator: MatPaginator;
  
  searchMovieFormGroup : FormGroup;
  loading = false;
  message;
  showMovieList = true;
  showMovieDetail = false;
  showFavoriteMovies = false;

  displayedFavoritesColumns = ['title','year','img'];
  displayedColumns = ['fav','title','year','img','id'];
  movies : MatTableDataSource<Search> = new MatTableDataSource([]);
  details : IMovie;
  favorites = [];

  constructor(private formBuilder : FormBuilder, private movieService : MovieService,private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.searchMovieFormGroup = this.formBuilder.group({
      movieName: ['', [Validators.minLength(3),Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]]
    });

    this.searchMovieFormGroup.valueChanges.subscribe( x=>
      {
        this.movies.data =[];
      }
    );
  }

  searchMovie(){
    this.loading = true;
    this.showMovieDetail=false;
    this.showFavoriteMovies =false;
    const param = this.searchMovieFormGroup.controls.movieName.value;
    this.movieService.searchMovie(param).subscribe( 
      resp => 
        {
          this.loading = false;
          if(resp.Response=="True"){
              this.showMovieList = true;
              this.message=null;
              this.movies.data = resp.Search;
              this.movies.paginator = this.moviesPaginator;
          }else if (resp.Response=="False"){
              this.message=resp.Error;
              this.movies.data =[];
          }
        },
      err => 
        {
          this.loading = false;
          this.message = "Ha ocurrido un error al realizar la búsqueda."
          this.movies.data =[];
        }
      );

  }

  viewMovieDetail(title:string){
    this.loading = true;
    this.showMovieList = false;
    this.showFavoriteMovies =false;
    this.movieService.searchMovieDetail(title).subscribe( 
      resp => 
        {
          this.loading = false;
          if(resp.Response=="True"){
            this.showMovieDetail=true;
            this.details = resp;
            this.message=null;
          }else if (resp.Response=="False"){
            this.message= resp.Error;
          }
        },
      err => 
        {
          this.loading = false;
          this.message = "Ha ocurrido un error al ver el detalle."
        }
      );
  }

  returnToMovieList(){
    this.showMovieList = true;
    this.showMovieDetail =false;
    this.showFavoriteMovies =false;
  }


  addToFavorites(row : any){
    localStorage.setItem(row.Title, JSON.stringify(row));
    this._snackBar.open("Agregado a favoritos","Cerrar",{duration:2000});
  }

  getFavorites(){
    this.showMovieList = false;
    this.showMovieDetail =false;
    const items = { ...localStorage };
    this.favorites =[];
    for(let a in items){

      try { 
        let object = JSON.parse(localStorage.getItem(a));
        if(object.hasOwnProperty("Title")){

          this.showFavoriteMovies =true;
          this.favorites.push(object);
          
        }
      }catch { 

      }
      
    }

  
    
  }

  clearFavorites(){
    localStorage.clear();
    this.favorites =[];
  }
}
