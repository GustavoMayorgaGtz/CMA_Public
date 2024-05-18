import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { server } from 'src/environments/environment';
import { ICMA_ENDPOINT_CREATE, ICMA_ENDPOINT_CREATE_RESPONSE, ICMA_ENDPOINT_DATABASE } from '../interfaces/CMA_EndpointInterfaces/cma_endpointInterface';
import { IBlobData_Database } from '../interfaces/BlobData/blobdatainterfaces';
@Injectable({
  providedIn: 'root'
})
export class CMA_ENDPOINT_SERVICES {

  constructor(private http: HttpClient) { }

  create_endpoint(body: ICMA_ENDPOINT_CREATE){ 
    return this.http.post<ICMA_ENDPOINT_CREATE_RESPONSE>(server + "cma_endpoint/create", body);
  }

  getAll_endpoints(){ 
    return this.http.get<ICMA_ENDPOINT_DATABASE[]>(server + "cma_endpoint/getAll");
  }

  getOneEndpointById(idendpoint:number , sizeActualArray: number){
    return this.http.post<IBlobData_Database[]>(server+"cma_endpoint/getLastLineChartValues", {idendpoint, sizeActualArray});
  }
}
