import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { server } from 'src/environments/environment';
import { IAlertSMS_Create, IAlertSMS_Database } from '../interfaces/AlertSMS/AlertSMS';

@Injectable({
  providedIn: 'root'
})
export class Alert_SMS_Service {
  constructor(private http: HttpClient) { }

  create(body: IAlertSMS_Create){
    return this.http.post<any>(server+"alert/create", body);
  }

  getAllAlertSMS(){
    return this.http.get<IAlertSMS_Database[]>(server+"alert/getAll");
  }
}
