import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class MessengerService {


  public getAlert: EventEmitter<boolean> = new EventEmitter<boolean>();
  public getCosa : EventEmitter<string> = new EventEmitter<string>();
  constructor(private http: HttpClient) { }


  setAlert(value: boolean){
    this.getAlert.emit(value)
  }
  setCosa(cosa: string){
    this.getCosa.emit(cosa);
  }


}
