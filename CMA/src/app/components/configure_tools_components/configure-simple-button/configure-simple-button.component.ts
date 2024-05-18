import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { BaseChartDirective } from 'ng2-charts';
import { JsonVariableClass } from 'src/app/functions/json_functions';
import { LineGraph } from 'src/app/graphs_class/line_chart';
import { IJsonVariable } from 'src/app/interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { getParamsLineChart } from 'src/app/interfaces/Line_ChartInterfaces/line_chartInterface';
import { IModbusVar } from 'src/app/interfaces/Modbus.interfaces/ModbusInterfaces';
import { ISimpleButtonConfiguration } from 'src/app/interfaces/SimpleButtonInterfaces/SimpleButtonInterface';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { CMA_ENDPOINT_SERVICES } from 'src/app/service/cma_endpoints.service';
import { ExitService } from 'src/app/service/exit.service';
import { finalizeService } from 'src/app/service/finalize.service';
import { SimpleButtonService } from 'src/app/service/simple_button_service';
import { VarsService } from 'src/app/service/vars';

@Component({
  selector: 'app-configure-simple-button',
  templateUrl: './configure-simple-button.component.html',
  styleUrls: ['./configure-simple-button.component.scss']
})
export class ConfigureSimpleButtonComponent implements OnInit {
  //Se define la variable que define los datos que se van a capturar
  public jsonBuilder = new JsonVariableClass(this.varsService, this.alert);

  @ViewChild(BaseChartDirective) canvas_chart!: BaseChartDirective;

  constructor(
    private all: AllService,
    private alert: AlertService,
    private varsService: VarsService,
    private simplebuttonService: SimpleButtonService,
    private finalizeServices: finalizeService,
    private exitService: ExitService,
    private cma_endpointService: CMA_ENDPOINT_SERVICES) {
  }

  public grafica_linear = new LineGraph(this.all,
    this.alert,
    this.varsService,
    this.finalizeServices,
    this.cma_endpointService
  );

  public linear1!: getParamsLineChart;
  public var1_labels: string[] = [];
  public var1_dataset: number[] = [];
  ngOnInit(): void {
    this.getVariables();
  }

  public jsonVariables: IJsonVariable[] = [];
  public modbusVariables: IModbusVar[] = [];
  getVariables() {
    this.varsService.getAllVarsJson().subscribe((variables) => {
      this.jsonVariables = variables.json;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })

    this.varsService.getAllVarsModbus().subscribe((variables) => {
      this.modbusVariables = variables;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })
  }


  public enableToSave: boolean = true;
  /**
   * Funcion para guardar un nuevo boton simple y validar las entradas antes de enviar
   */
  private simple_button_configuration!: ISimpleButtonConfiguration;
  saveConfiguration_Event(): void {
    this.enableToSave = false;
    let readyToSave = true; //Variable de control
    if ((!this.title || this.title.length > 200)) {
      this.alert.setMessageAlert("Define un titulo menor de 200 caracteres");
      readyToSave = false;
    }
    if ((!this.description || this.description.length > 255)) {
      this.alert.setMessageAlert("Define una descripcion menor de 255 caracteres");
      readyToSave = false;
    }
    if (!this.idJsonVariable && !this.idModbusVariable) {
      this.alert.setMessageAlert("No haz definido la variable");
      readyToSave = false;
    }
    if (!this.fill_color) {
      this.alert.setMessageAlert("Define el color del fondo");
      readyToSave = false;
    }
    if (!this.text_color) {
      this.alert.setMessageAlert("Define el color del texto");
      readyToSave = false;
    }

    if (this.style_button != "normal" && this.style_button != "circle") {
      this.alert.setMessageAlert("Define el estilo del boton");
      readyToSave = false;
    }
    if (readyToSave) {
      this.simple_button_configuration =
      {
        title: this.title,
        description: this.description,
        idVariableJson: this.idJsonVariable,
        idVariableModbus: this.idModbusVariable,
        background_color: this.fill_color,
        text_color: this.text_color,
        style_button: this.style_button
      }

      this.simplebuttonService.create_SimpleButton(this.simple_button_configuration)
        .subscribe((data) => {
          this.alert.setMessageAlert("Se registro la configuracion del boton");
          window.location.reload();
          this.enableToSave = true;
        }, (err: HttpErrorResponse) => {
          this.enableToSave = true;
          this.alert.setMessageAlert(err.message);
        })
    } else {
      this.enableToSave = true;
    }
  }

  /**
   * Funcion para seleccionar una variable json|modbus
   * @param idVariable 
   * @param type 
   */
  private idJsonVariable: any = null;
  private idInArray: any = null; //Para modbus y para json
  private idModbusVariable: any = null;
  selectVariableToGraph(idVariable: number, type: number, idInArray: number) {
    if (type == 1) {
      this.idJsonVariable = idVariable;
      this.idModbusVariable = null;
    }
    if (type == 2) {
      this.idModbusVariable = idVariable;
      this.idJsonVariable = null;
    }

    this.idInArray = idInArray;
  }

  private title: string = "Boton simple";
  set setTitle(title: string) {
    this.title = title;
  }
  get getTitle() {
    return this.title;
  }

  private description: string = "Descripcion de un boton simple";
  set setDescription(description: string) {
    this.description = description;
  }

  private fill_color: string = "#5d7794";
  setFill_Color(color: string, buttonInput: HTMLDivElement) {
    this.fill_color = color;
    this.setChangesButton(buttonInput);
  }


  private text_color: string = "#000000";
  setText_Color(color: string, buttonInput: HTMLDivElement) {
    this.text_color = color;
    this.setChangesButton(buttonInput);
  }

  get getText_Color() {
    return this.text_color
  }

  private style_button: 'normal' | 'circle' = "normal";
  setStyle_Button(style_input: string, button: HTMLDivElement) {
    if (style_input === 'circle' || style_input === 'normal') {
      this.style_button = style_input;
      this.setChangesButton(button);
    }
  }


  setChangesButton(button: HTMLDivElement) {
    if (this.style_button == "circle") {
      const width = button.getBoundingClientRect().width / 2;
      const style = `
      color: ${this.text_color};
      background-color: ${this.fill_color};
      border-radius: 50%;
      height: ${width}px;
      width: ${width}px;
      `;
      button.setAttribute("style", style);
    } else {
      const style = `
      color: ${this.text_color};
      background-color: ${this.fill_color};
      border-radius: 5px;
      `;
      button.setAttribute("style", style);
    }
  }

  clickEvent() {
    if (this.idJsonVariable) {
      //Realizar la peticion de jsonendpoint
      const variable = this.jsonVariables[this.idInArray];
      this.jsonBuilder.doQuery(variable)
        .then((data) => {
          this.alert.setMessageAlert("Exito");
        })
        .catch((err) => {
          this.alert.setMessageAlert(err);
        })

    } else if (this.idModbusVariable) {
      //Realizar la peticion de modbusendpoint

    } else {
      this.alert.setMessageAlert("No se ha seleccionado ninguna variable.")
    }
  }


   /**
   * Funcion para regresar al menu principal y salir del modo configuracion
   */
   return() {
    this.exitService.setExitConfigurationGraphLine();
  }
}
