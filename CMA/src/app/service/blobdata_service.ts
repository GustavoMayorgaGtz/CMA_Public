import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { server } from 'src/environments/environment';
import { IBlobData_Database } from '../interfaces/BlobData/blobdatainterfaces';

@Injectable({
  providedIn: 'root'
})
export class BlobDataService {

  constructor(private http: HttpClient) { }


  getOneBlobDataById(idblobdata: number){
     return this.http.post<IBlobData_Database>(server + "blobdata/getById", {idblobdata});
  }

}
