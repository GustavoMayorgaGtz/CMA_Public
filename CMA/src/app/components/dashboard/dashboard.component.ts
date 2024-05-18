import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JsonVariableClass } from 'src/app/functions/json_functions';
import { LineGraph } from 'src/app/graphs_class/line_chart';
import { IJsonVariable } from 'src/app/interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { ISimpleButtonDatabase } from 'src/app/interfaces/SimpleButtonInterfaces/SimpleButtonInterface';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { CMA_ENDPOINT_SERVICES } from 'src/app/service/cma_endpoints.service';
import { ExitService } from 'src/app/service/exit.service';
import { finalizeService } from 'src/app/service/finalize.service';
import { SimpleButtonService } from 'src/app/service/simple_button_service';
import { VarsService } from 'src/app/service/vars';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public jsonBuilder = new JsonVariableClass(this.varsService, this.alertService);
  public menu_tool: number = 1;

  set set_menu_tool(option: number) {
    this.menu_tool = option;
  }

  constructor(private service: AllService,
    private alertService: AlertService,
    private varsService: VarsService,
    private simpleButtonService: SimpleButtonService,
    private finalizeServices: finalizeService,
    private exitService: ExitService,
    private cma_endpointService: CMA_ENDPOINT_SERVICES) {
  }

  public linear1: any;
  ngOnInit(): void {
    this.exitService.exitConfigurationGraphLine.subscribe(() => {
      this.set_menu_tool = 1;
    })
    const grafica_linear1 = new LineGraph(this.service,
      this.alertService,
      this.varsService, this.finalizeServices,
    this.cma_endpointService);
    this.getVariables();
  }

  public var1_labels: string[] = [];
  public var1_dataset: number[] = [];
  public jsonVariables: IJsonVariable[] = [];
  public simpleButtons: ISimpleButtonDatabase[] = [];
  getVariables() {
    this.varsService.getAllVarsJson().subscribe((variables) => {
      this.jsonVariables = variables.json;
      // setInterval(() => {
      //   this.jsonBuilder.doQuery(this.jsonVariables[3])
      //     .then((value) => {
      //       this.var1_dataset.push(value as number);
      //       this.var1_labels.push(value as string);
      //       const grafica_linear1 = new LineGraph(this.service,
      //         this.alertService,
      //         this.varsService);

      //       // this.linear1 = grafica_linear1.getParams();
      //     })
      //     .catch((err) => {
      //       console.log("Error al realizar la peticion: ", err)
      //     })
      // }, 10000);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })

    this.simpleButtonService.getAll_SimpleButton().subscribe((simple_buttons) => {
      this.simpleButtons = simple_buttons;
    }, (err: HttpErrorResponse) => {
      console.log("Simple button error:", err);
    })
  }
}
