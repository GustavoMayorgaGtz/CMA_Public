import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { IlineChartConfiguration, LineChartConfigurationDatabase } from '../interfaces/Line_ChartInterfaces/line_chartInterface';
import { server } from 'src/environments/environment';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';
@Injectable({
  providedIn: 'root'
})
export class LineChartService {

  constructor(private http: HttpClient) { }


  getAllLineChart(){
     return this.http.get<LineChartConfigurationDatabase[]>(server+"linechart/getAll");
  }

  create_LineChart(line_chart_configuration: IlineChartConfiguration){
          return this.http.post<any>(server+"linechart/create", line_chart_configuration)
  }

  getOneById(idlinealchart: number){
    return this.http.get<LineChartConfigurationDatabase>(server+`linechart/getOne?idlinechart=${idlinealchart}`)
  }
  updatePositionAndSizeLineChart(params: IConfigurationShadow){
    return this.http.post(server+"linechart/positions", params);
  }
}
