import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { ISimpleButtonConfiguration, ISimpleButtonDatabase } from '../interfaces/SimpleButtonInterfaces/SimpleButtonInterface';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';
@Injectable({
  providedIn: 'root'
})
export class SimpleButtonService {

  constructor(private http: HttpClient) { }


  create_SimpleButton(simpleButton: ISimpleButtonConfiguration) {
    return this.http.post<ISimpleButtonConfiguration>(server + "simplebutton/create", simpleButton);
  }

  getAll_SimpleButton() {
    return this.http.get<ISimpleButtonDatabase[]>(server + "simplebutton/getAll");
  }


  getOneById_SimpleButton(idSimpleButton: number){
    return this.http.get<ISimpleButtonDatabase[]>(server + `simplebutton/getOneById?idSimpleButton=${idSimpleButton}`);
  }

  updatePositionAndSizeSimpleButtons(params: IConfigurationShadow){
    return this.http.post(server+"simplebutton/positions", params);
  }


}
