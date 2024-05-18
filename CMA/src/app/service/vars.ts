import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IJsonVariable, IJsonVariable_Create } from '../interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { server } from 'src/environments/environment';
import { IMemoryVar, IModbusVar, IModbusVar_Create, IModbusVar_Test } from '../interfaces/Modbus.interfaces/ModbusInterfaces';
import { AllVar } from '../interfaces/interfaces';
import { Observable, ObservableLike } from 'rxjs';
import { IBlobData, IBlobData_Database } from '../interfaces/BlobData/blobdatainterfaces';
@Injectable({
  providedIn: 'root'
})
export class VarsService {

  constructor(private http: HttpClient) { }

  getAllVars() {
    return this.http.get<AllVar[]>(server + "vars/get");
  }
  getAllVarsJson() {
    interface AllVar {
      json: IJsonVariable[]
    }
    return this.http.get<AllVar>(server + "jsonvars/getAll");
  }

  getJsonVarById(idJsonVariable: number) {
    return this.http.get<IJsonVariable[]>(server + "jsonvars/getOne?idjsonvar=" + idJsonVariable);
  }


  type_GET(url: string) {
    return this.http.get<Object>(url);
  }
  type_POST(url: string, body: Object): Observable<any> {
    const options = {
      headers: {
        'Origin': url
      }
    };

    return this.http.post<any>(url, body, options);
  }
  type_PUT(url: string, body: object) {
    return this.http.put<Object>(url, body);
  }
  type_OPTIONS(url: string, body: object) {
    return this.http.options<Object>(url, body);
  }
  type_DELETE(url: string, body: object) {
    return this.http.delete<Object>(url, body);
  }
  type_PATCH(url: string, body: object) {
    return this.http.patch<Object>(url, body);
  }
  type_HEAD(url: string, body: object) {
    return this.http.head<Object>(url, body);
  }

  create_Json_Var(body: IJsonVariable_Create) {
    console.log(body)
    return this.http.post(server + "jsonvars/create", body);
  }


  test_Modbus_var(body: IModbusVar_Test) {
    return this.http.post(server + "modbusvars/testConnection", body);
  }

  getAllVarsModbus() {
    return this.http.get<IModbusVar[]>(server + "modbusvars/getAll");
  }


  getModbusVarById(idmodbusvar: number) {
    return this.http.get<IModbusVar[]>(server + "modbusvars/getOne?idmodbusvar=" + idmodbusvar);
  }

  create_Modbus_var(body: IModbusVar_Create) {
    return this.http.post<any>(server + "modbusvars/create", body);
  }

  create_memory_var(name: string, expression: string) {
    return this.http.post<any>(server + "memoryvars/create", { name, expression });
  }


  getAllVarsMemory() {
    return this.http.get<IMemoryVar[]>(server + "memoryvars/getAll");
  }


  getMemoryVarById(idmemoryvar: number) {
    return this.http.get<IMemoryVar[]>(server + "memoryvars/getOne?idmemoryvar=" + idmemoryvar);
  }

  setValueBlobData(body: IBlobData) {
    return this.http.post<any>(server + "blobdata/insertValue", body);
  }

  getBlobDataById(idblobdata: number) {
    return this.http.post<IBlobData_Database>(server + "blobdata/getById", { idblobdata });
  }
}

