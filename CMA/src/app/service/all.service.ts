import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class AllService {

  constructor(private http: HttpClient) { }

  getDitto(){
    
    return this.http.get<Object>("https://pokeapi.co/api/v2/pokemon/ditto");
  }

  jsonExample1(){
    return this.http.get<Object>("http://localhost:5000/getJsonExample1")
  }
}
