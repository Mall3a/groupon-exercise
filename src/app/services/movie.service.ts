import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISearch } from '../interfaces/ISearch';
import { IMovie } from '../interfaces/IMovie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  apiKey = '5c6682b0';
  baseURL= 'http://www.omdbapi.com/';

  constructor(private httpClient : HttpClient) { }

  searchMovie(param:string){
    return this.httpClient.get<ISearch>(`${this.baseURL}?apikey=${this.apiKey}&s=${param}`);
  }
  searchMovieDetail(title:string){
    return this.httpClient.get<IMovie>(`${this.baseURL}?apikey=${this.apiKey}&t=${title}`);
  }


}
