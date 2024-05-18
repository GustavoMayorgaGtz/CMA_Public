import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScatterDataPoint } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BLOBDATA } from 'src/app/functions/blobdata_class';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { LineGraph } from 'src/app/graphs_class/line_chart';
import { IBlobData_Table } from 'src/app/interfaces/BlobData/blobdatainterfaces';
import { getParamsLineChart, IlineChartConfiguration } from 'src/app/interfaces/Line_ChartInterfaces/line_chartInterface';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { AuthService } from 'src/app/service/auth.service';
import { BlobDataService } from 'src/app/service/blobdata_service';
import { CMA_ENDPOINT_SERVICES } from 'src/app/service/cma_endpoints.service';
import { finalizeService } from 'src/app/service/finalize.service';
import { LineChartService } from 'src/app/service/linechart_service';
import { VarsService } from 'src/app/service/vars';

@Component({
  selector: 'app-blobdata',
  templateUrl: './blobdata.component.html',
  styleUrls: ['./blobdata.component.scss']
})
export class BlobdataComponent implements OnInit {

  public title: string = "Grafica Lineal";
  public description: string = "";


  public grafica_linear = new LineGraph(this.all,
    this.alert,
    this.varsServices,
    this.finalizeServices,
    this.cma_endpointServices);
  @ViewChild(BaseChartDirective) canvas_chart!: BaseChartDirective;
  private blobData = new BLOBDATA(this.varsServices);
  public linear1!: getParamsLineChart;



  public authClass = new auth_class(this.router, this.authService, this.alert);
  constructor(private route: ActivatedRoute,
    private varsServices: VarsService,
    private alert: AlertService,
    private all: AllService,
    private linechart: LineChartService,
    private router: Router,
    private blobdataServices: BlobDataService,
    private finalizeServices: finalizeService,
    private cma_endpointServices: CMA_ENDPOINT_SERVICES,
    private authService: AuthService) { 
      this.authClass.validateUser();
    }




  public blobdataInformation: IBlobData_Table[] = [];

  public samplingNumber: number = 200;
  public typeChart !: 'line' | 'bar';
  ngOnInit(): void {
    this.linear1 = this.grafica_linear.defaultParams();
    this.route.queryParams.subscribe(params => {
      let idblobdata = params['idblobdata']; //Este es el id del blobdata
      let idgraph = params['idgraph']; //Este es el id de la grafica
      let type = params['type']; //Este es el tipo de la grafica

      this.blobdataServices.getOneBlobDataById(idblobdata).subscribe((blobdata) => {
        blobdata.value.forEach((valor, idx) => {
            this.blobdataInformation.push({valor: valor, fecha: blobdata.register_date[idx]});
        })

      }, (err: HttpErrorResponse) => {
        console.log(err)
      })
      //Validar que tipo de grafica se va a mostrar por el momento
      this.typeChart = type;
      this.linechart.getOneById(idgraph).subscribe((graph_line) => {
        this.title = graph_line.title;
        this.description = graph_line.description;
        this.samplingNumber = graph_line.sampling_number;
        const linear_chart_configuration: IlineChartConfiguration = {
          general: {
            title: graph_line.title,
            description: graph_line.description,
            idVariableModbus: graph_line.idvariablemodbus,
            idVariableJson: graph_line.idvariablejson,
            idVariableMemory: graph_line.idvariablememory,
            idVariableEndpoint: graph_line.idvariableendpoint,
            sampling_number: graph_line.sampling_number,
            isArray: graph_line.isarray,
            issaveblobdata: graph_line.issaveblobdata,
            idblobdata: idblobdata,
            polling: {
              time: graph_line.polling_time,
              type: graph_line.polling_type
            }
          },
          styles: {
            fill: graph_line.fill,
            fill_color: graph_line.fill_color,
            line: graph_line.line,
            line_color: graph_line.line_color,
            line_size: graph_line.line_size,
            line_tension: graph_line.line_tension,
            line_stepped: graph_line.line_stepped,
            point_style: graph_line.point_style,
            point_color: graph_line.point_color,
            point_border_color: graph_line.point_border_color,
            point_border_size: graph_line.point_border_size,
            point_width: graph_line.point_width
          }
        }
        this.grafica_linear.reloadData(linear_chart_configuration);
        this.grafica_linear.eventData.subscribe((graph_configuration) => {
          this.linear1 = graph_configuration;
          if (this.canvas_chart) {
            this.canvas_chart.chart?.update()
          }
        });

      }, (err: HttpErrorResponse) => {
        console.log(err);
      })
    });
  }



  public groupByDataOption: number = 1;
  groupByData(option: number){
    this.groupByDataOption = option;
    this.grafica_linear.groupByDate(option);
  }

  /**
   * Se usa esta funcion para obtener el objeto de la grafica
   * @param graficas 
   * @returns 
   */
  public chart!: BaseChartDirective<"line", (number | ScatterDataPoint | null)[], unknown>;
  obtenerObjeto(graficas: HTMLCanvasElement) {
    this.chart = graficas as unknown as BaseChartDirective<"line", (number | ScatterDataPoint | null)[], unknown>;
    return {};
  }


  cerrar() {
    this.router.navigate(['/']);
    this.finalizeServices.finalizeAllPolling_Event();
  }
}
