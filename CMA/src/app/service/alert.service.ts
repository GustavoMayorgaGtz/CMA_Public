import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public getMessageAlert:EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  setMessageAlert(message: string){
    this.getMessageAlert.emit(message);
  }
}
