import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { BaseChartDirective } from 'ng2-charts';
import { CalculatorExpression } from 'src/app/functions/calculatorExpression';
import { JsonVariableClass } from 'src/app/functions/json_functions';
import { LineGraph } from 'src/app/graphs_class/line_chart';
import { ICMA_ENDPOINT_DATABASE } from 'src/app/interfaces/CMA_EndpointInterfaces/cma_endpointInterface';
import { IJsonVariable } from 'src/app/interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { IlineChartConfiguration, getParamsLineChart } from 'src/app/interfaces/Line_ChartInterfaces/line_chartInterface';
import { IMemoryVar, IModbusVar } from 'src/app/interfaces/Modbus.interfaces/ModbusInterfaces';
import { AllVar } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { CMA_ENDPOINT_SERVICES } from 'src/app/service/cma_endpoints.service';
import { ExitService } from 'src/app/service/exit.service';
import { finalizeService } from 'src/app/service/finalize.service';
import { LineChartService } from 'src/app/service/linechart_service';
import { VarsService } from 'src/app/service/vars';

@Component({
  selector: 'app-configure-linear-graph',
  templateUrl: './configure-linear-graph.component.html',
  styleUrls: ['./configure-linear-graph.component.scss']
})
export class ConfigureLinearGraphComponent implements OnInit {

  //Se define la variable que define los datos que se van a capturar
  private linear_chart_configuration!: IlineChartConfiguration;
  public jsonBuilder = new JsonVariableClass(this.varsService, this.alert);

  @ViewChild(BaseChartDirective) canvas_chart!: BaseChartDirective;

  constructor(
    private all: AllService,
    private alert: AlertService,
    private varsService: VarsService,
    private linechartService: LineChartService,
    private finalizeServices: finalizeService,
    private exitService: ExitService,
    private endpointService: CMA_ENDPOINT_SERVICES
  ) {


  }
  public grafica_linear = new LineGraph(this.all,
    this.alert,
    this.varsService, this.finalizeServices, this.endpointService);

  public linear1!: getParamsLineChart;


  public var1_labels: string[] = [];
  public var1_dataset: number[] = [];
  ngOnInit(): void {
    this.getVariables();
    this.redefineOptions();
  }


  public jsonVariables: IJsonVariable[] = [];
  public modbusVariables: IModbusVar[] = [];
  public memoryVariables: IMemoryVar[] = [];
  public endpointVariables: ICMA_ENDPOINT_DATABASE[] = [];
  public Vars_names: string[] = [];
  public vars!: AllVar[];
  getVariables() {
    this.varsService.getAllVars().subscribe((vars) => {
      this.vars = vars;
      this.Vars_names = vars.map((vars) => {
        return vars.name;
      })
    });

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
    this.varsService.getAllVarsMemory().subscribe((variables_memoria) => {
      if (variables_memoria.length > 0) {
        this.getNextResultMemoryVar(variables_memoria, 0, variables_memoria.length)
      }
    }, (err) => {
      this.alert.setMessageAlert(err);
      console.log(err.message)
    })

    this.endpointService.getAll_endpoints().subscribe((variables_endpoint) => {
      this.endpointVariables = variables_endpoint;
    }, (err: HttpErrorResponse) => {
      this.alert.setMessageAlert(err.message);
      console.log(err);
    })
  }


  getNextResultMemoryVar(vars: IMemoryVar[], id: number, size: number) {
    const newRegex = new CalculatorExpression(this.varsService);
    newRegex.parserRegexVars(vars[id].expression, this.vars, this.Vars_names, this.jsonBuilder)
    newRegex.getMessage.subscribe((result) => {
      vars[id].result = parseFloat(result);
      if (id == size - 1) {
        this.memoryVariables = vars;
      } else {
        this.getNextResultMemoryVar(vars, (id + 1), size)
      }
    });
  }


  /*_______FUNCIONES_________________________________________________________________________*/

  public enableSave: boolean = true;
  /**
   * Funcion para guardar y validar todos los parametros de la grafica lineal
   */
  saveConfiguration_Event(): void {
    this.enableSave = false;
    //Comprobar parametros
    let readyToSave = true; //Variable de control
    //TITULO
    if ((!this.title || this.title.length > 200)) {
      this.alert.setMessageAlert("Define un titulo menor de 200 caracteres");
      readyToSave = false;
    }
    //DESCRIPCION
    if ((!this.description || this.description.length > 255)) {
      this.alert.setMessageAlert("Define una descripcion menor de 255 caracteres");
      readyToSave = false;
    }
    //IDVARIABLE
    if (!this.idJsonVariable && !this.idModbusVariable && !this.idMemoryVariable && !this.idEndpointVariable) {
      this.alert.setMessageAlert("No haz definido la variable");
      readyToSave = false;
    }
    //MUESTREO
    if (!this.sampling_number) {
      this.alert.setMessageAlert("No haz definido el numero de datos limites a graficar")
      readyToSave = false;
    }
    //POLLING_TIME
    if (!this.polling_time) {
      this.alert.setMessageAlert("Define el tiempo de refresco del dato");
      readyToSave = false;
    }
    //POLLING_TYPE
    if (!this.polling_type) {
      this.alert.setMessageAlert("Define el tipo tiempo de refresco del dato");
      readyToSave = false;
    }
    //COLOR DEL AREA
    if (this.fill) {
      if (!this.fill_color) {
        this.alert.setMessageAlert("Define el color del area");
        readyToSave = false;
      }
    }
    //COLOR DE LINEA
    if (this.line) {
      if (!this.line_color) {
        this.alert.setMessageAlert("Define el color de la linea conectora");
        readyToSave = false;
      }
      if (this.line_size == 0 || !this.line_size) {
        this.line_size = 1;
      }
      if (!this.line_tension) {
        this.setLine_Tension = "0.1";
      }
    }
    //ESTILO DEL PUNTO CONECTOR
    if (!this.point_style) {
      this.point_style = "circle";
    }
    //COLOR DEL PUNTO CONECTOR
    if (!this.point_color) {
      this.alert.setMessageAlert("Define un color para el punto conector");
      readyToSave = false;
    }
    //COLOR DEL BORDE DEL PUNTO CONECTO
    if (!this.point_border_color) {
      this.alert.setMessageAlert("Define el color del borde del punto conector");
      readyToSave = false;
    }
    //TAMAÑO DEL BORDE DEL PUNTO CONECTOR
    if (!this.point_border_size) {
      this.point_border_size = 2;
    }
    //TAMAÑO DEL PUNTO CONECTOR
    if (!this.point_width) {
      this.point_width = 5;
    }

    if (readyToSave) {
      this.linear_chart_configuration = {
        general: {
          title: this.title,
          description: this.description,
          idVariableModbus: this.idModbusVariable,
          idVariableJson: this.idJsonVariable,
          idVariableMemory: this.idMemoryVariable,
          idVariableEndpoint: this.idEndpointVariable,
          sampling_number: this.sampling_number,
          isArray: this.isArray,
          issaveblobdata: this.isSaveBlobData,
          idblobdata: null,
          polling: {
            time: this.polling_time,
            type: this.polling_type
          }
        },
        styles: {
          fill: this.fill,
          fill_color: this.fill_color,
          line: this.line,
          line_color: this.line_color,
          line_size: this.line_size,
          line_tension: this.line_tension,
          line_stepped: this.line_stepped,
          point_style: this.point_style,
          point_color: this.point_color,
          point_border_color: this.point_border_color,
          point_border_size: this.point_border_size,
          point_width: this.point_width
        }
      }

      this.linechartService.create_LineChart(this.linear_chart_configuration).subscribe((response) => {
        console.log(response);
        this.alert.setMessageAlert("Grafico Lineal creado exitosamente.");
        window.location.reload();
        this.enableSave = true;
      }, (err: HttpErrorResponse) => {
        this.enableSave = true;
        console.log(err);
      })
    } else {
      this.enableSave = true;
    }
  }

  /**
   * Funcion para seleccionar una variable json|modbus
   * @param idVariable 
   * @param type 
   */
  selectVariableToGraph(idVariable: number, type: number) {
    //Json
    if (type == 1) {
      this.idJsonVariable = idVariable;
      this.idModbusVariable = null;
      this.idMemoryVariable = null;
      this.idEndpointVariable = null;
    }

    //Modbus
    if (type == 2) {
      this.idModbusVariable = idVariable;
      this.idJsonVariable = null;
      this.idMemoryVariable = null;
      this.idEndpointVariable = null;
    }
    if (type == 3) {
      this.idModbusVariable = null;
      this.idJsonVariable = null;
      this.idMemoryVariable = idVariable;
      this.idEndpointVariable = null;
    }
    if (type == 4) {
      this.idModbusVariable = null;
      this.idJsonVariable = null;
      this.idMemoryVariable = null;
      this.idEndpointVariable = idVariable;
    }
    this.redefineOptions();
  }



  /**
   * Funcion para cargar los cambios en la grafica actual cuando se detecta un nuevo valor o cambios en las entradas de configuracion
   */
  public isVisible = true;
  redefineOptions() {
    // this.varsService.getAllVars().subscribe((vars) => {

    // })
    this.linear_chart_configuration = {
      general: {
        title: this.title,
        description: this.description,
        idVariableModbus: this.idModbusVariable,
        idVariableJson: this.idJsonVariable,
        idVariableMemory: this.idMemoryVariable,
        idVariableEndpoint: this.idEndpointVariable,
        sampling_number: this.sampling_number,
        isArray: this.isArray,
        idblobdata: null,
        issaveblobdata: this.isSaveBlobData,
        polling: {
          time: this.polling_time,
          type: this.polling_type
        }
      },
      styles: {
        fill: this.fill,
        fill_color: this.fill_color,
        line: this.line,
        line_color: this.line_color,
        line_size: this.line_size,
        line_tension: this.line_tension,
        line_stepped: this.line_stepped,
        point_style: this.point_style,
        point_color: this.point_color,
        point_border_color: this.point_border_color,
        point_border_size: this.point_border_size,
        point_width: this.point_width
      }
    }
    this.grafica_linear.reloadData(this.linear_chart_configuration, this.vars, this.Vars_names);
    this.grafica_linear.eventData.subscribe((graph_configuration) => {
      this.linear1 = graph_configuration;
      if (this.canvas_chart) {
        // this.canvas_chart.chart?.reset()
        this.canvas_chart.chart?.update()
      }
    });
  }




  /*_______VARIABLES Y ENCAPSULAMIENTO______________________________________________________*/
  private title: string = "Linear";
  set setTitle(title: string) {
    this.title = title;
    this.redefineOptions();
  }

  private description: string = "Descripcion basica de una grafica lineal";
  set setDescription(description: string) {
    this.description = description;
  }

  private idJsonVariable: any = null;
  set setIdJsonVariable(idJson: number) {
    this.idJsonVariable = idJson;
  }

  private idModbusVariable: any = null;
  set setIdModbusVariable(idModbus: number) {
    this.idModbusVariable = idModbus;
  }

  private idMemoryVariable: any = null;
  set setIdMemoryVariable(idMemory: number) {
    this.idMemoryVariable = idMemory;
  }

  private idEndpointVariable: any = null;
  set setIdEndpointVariable(idEndpoint: number) {
    this.idEndpointVariable = idEndpoint;
  }

  private sampling_number: number = 2;
  set setSampling_number(muestreo: string) {
    this.sampling_number = parseInt(muestreo);
    this.redefineOptions();
  }

  get getsampling_number() {
    return this.sampling_number;
  }

  private polling_time: number = 10;
  set setPolling_Time(time: string) {
    this.polling_time = parseInt(time);
    this.redefineOptions();
  }

  private polling_type: "sg" | "mn" | "hr" = "sg";
  set setPolling_Type(type: string) {
    if (type === "sg" || type === "mn" || type === "hr")
      this.polling_type = type;
    this.redefineOptions();
  }

  private isArray: boolean = false;
  set set_isArray(value: boolean) {
    this.isArray = value;
    this.redefineOptions();
  }

  private isSaveBlobData: boolean = false;
  set set_isSaveBlobData(value: boolean) {
    this.isSaveBlobData = value;
    this.redefineOptions();
  }

  private fill: boolean = true;
  set setFill(value: boolean) {
    this.fill = value;
    this.redefineOptions();
  }

  private fill_color: string = "#33556F";
  set setFill_Color(color: string) {
    this.fill_color = color;
    this.redefineOptions();
  }

  private line: boolean = true;
  set setLine(line: boolean) {
    this.line = line;
    this.redefineOptions();
  }

  private line_color: string = "#000000";
  set setLine_Color(color: string) {
    this.line_color = color;
    this.redefineOptions();
  }

  private line_size: number = 2;
  set setline_Size(size: number) {
    this.line_size = size;
    this.redefineOptions();
  }

  private line_tension: number = 0.8;
  set setLine_Tension(tension: string) {
    if (parseFloat(tension) >= 0 && parseFloat(tension) <= 1) {
      this.line_tension = parseFloat(tension);
      this.redefineOptions();
    } else if (parseFloat(tension) > 1) {
      this.setLine_Tension = "1";
    }
    else if (parseFloat(tension) < 0) {
      this.setLine_Tension = "0";
    }
  }

  get getLine_Tension() {
    return this.line_tension
  }

  private line_stepped: boolean = false;
  set setLine_Stepped(stepped: boolean) {
    this.line_stepped = stepped;
    this.redefineOptions();
  }

  private point_style: "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle" = "circle";

  set setPoint_Style(style: string) {
    if (["circle", "cross", "crossRot", "dash", "line", "rect", "rectRounded", "rectRot", "star", "triangle"].includes(style)) {
      this.point_style = style as "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle";
      this.redefineOptions();
    }
  }

  private point_color: string = "#33556F";
  set setPoint_Color(color: string) {
    this.point_color = color;
    this.redefineOptions();
  }

  private point_border_color: string = "#ffffff";
  set setPoint_Border_Color(color: string) {
    this.point_border_color = color;
    this.redefineOptions();
  }

  private point_border_size: number = 2;
  set setPoint_Border_Size(size: string) {
    this.point_border_size = parseFloat(size);
    this.redefineOptions();
  }

  private point_width: number = 2;
  set setPoint_Width(width: string) {
    this.point_width = parseFloat(width);
    this.redefineOptions();
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


  /**
   * Funcion para regresar al menu principal y salir del modo configuracion
   */
  return() {
    this.exitService.setExitConfigurationGraphLine();
  }
}