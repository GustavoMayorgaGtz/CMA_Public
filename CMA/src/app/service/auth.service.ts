import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { login, register } from '../interfaces/LoginInterface/login.interface';
import { timeout } from 'rxjs';
import { server } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //peticion para iniciar sesion
  login_user(body: login) {
    interface dataResponse{
      user: number,
      token: string
    }
    return this.http.post<dataResponse>( server+"auth/login", body)
      .pipe(timeout(5000));
  }



  //peticion para registrar usuario
  register_user(body: object) {
    return this.http.post<Object>(server+"auth/register", body)
      .pipe(timeout(5000));
  }




  authUser(idUser: number, token: string){
      // Agrega el token Bearer al encabezado de la solicitud
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.post<any>(server+"auth/validateAuth", {idUser}, {headers})
  }

  
}