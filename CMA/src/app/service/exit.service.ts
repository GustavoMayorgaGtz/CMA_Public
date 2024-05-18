import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExitService {
  public exitConfigurationGraphLine :EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  setExitConfigurationGraphLine(){
    this.exitConfigurationGraphLine.emit(true);
  }
}
