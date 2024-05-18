import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class finalizeService {
  public finalizeAllPolling:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  finalizeAllPolling_Event(){
    this.finalizeAllPolling.emit(true);
  }
}
