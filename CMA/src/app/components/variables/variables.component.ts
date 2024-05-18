import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalculatorExpression } from 'src/app/functions/calculatorExpression';
import { JsonVariableClass } from 'src/app/functions/json_functions';
import { ModbusVariableClass } from 'src/app/functions/modbus_functions';
import { ICMA_ENDPOINT_CREATE_RESPONSE, ICMA_ENDPOINT_DATABASE } from 'src/app/interfaces/CMA_EndpointInterfaces/cma_endpointInterface';
import { IJsonVariable } from 'src/app/interfaces/JsonEndpointsInterfaces/JsonEndpointI';
import { IMemoryVar, IModbusVar } from 'src/app/interfaces/Modbus.interfaces/ModbusInterfaces';
import { AllVar } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { CMA_ENDPOINT_SERVICES } from 'src/app/service/cma_endpoints.service';
import { VarsService } from 'src/app/service/vars';


@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})

export class VariablesComponent implements OnInit, AfterViewInit {

  @ViewChild('nombre') NombreElementRef!: ElementRef<HTMLInputElement>;
  public nombre!: HTMLInputElement;
  @ViewChild('url') UrlElementRef!: ElementRef<HTMLInputElement>;
  public url!: HTMLInputElement;
  @ViewChild('metodo') MetodoElementRef!: ElementRef<HTMLSelectElement>;
  public metodo!: HTMLSelectElement;
  public jsonBuilder = new JsonVariableClass(this.varsService, this.alertService);
  public modbusBuilder = new ModbusVariableClass(this.varsService, this.alertService);

  constructor(private service: AllService,
    private alertService: AlertService,
    private varsService: VarsService,
    private cma_endpointService: CMA_ENDPOINT_SERVICES) {
  }

  ngAfterViewInit(): void {
    if (this.NombreElementRef) {
      this.nombre = this.NombreElementRef.nativeElement;
    }
    if (this.UrlElementRef) {
      this.url = this.UrlElementRef.nativeElement
    }
    if (this.MetodoElementRef) {
      this.metodo = this.MetodoElementRef.nativeElement
    }
  }

  /*___________________________________________________________*/
  //MANEJANDO VISTA PARA LA CREACION DE UNA VIARIABLE DE JSON
  ngOnInit(): void {
    this.getVariables();
    this.regex.getMessage.subscribe((result) => {
      this.alertService.setMessageAlert("Resultado: " + result);
    })
    this.jsonBuilder.output_show_datos.subscribe((state) => {
      this.showDatos = state;
      this.showSeguridad = (state) ? false : this.showSeguridad;
    })
    this.modbusBuilder.output_modbus_variableCreada.subscribe(() => {
      this.refreshData();
      this.menu = 1;
    })
    this.jsonBuilder.output_show_seguridad.subscribe((state) => {
      this.showSeguridad = state;
      this.showDatos = (state) ? false : this.showDatos;
    })
    this.jsonBuilder.output_show_jsonViewer.subscribe((state) => {
      this.showSeleccion = state;
    })
    this.jsonBuilder.output_show_variableCreada.subscribe((state) => {
      if (this.metodo) {
        this.metodo.value = "";
      }
      if (this.url) {
        this.url.value = "";
      }
      if (this.nombre) {
        this.nombre.value = "";
      }
      this.refreshData();
      this.menu = 1;
    })
  }









  public jsonVariables: IJsonVariable[] = [];
  public modbusVariables: IModbusVar[] = [];
  public memoryVariables: IMemoryVar[] = []
  public variablesEndpoint: ICMA_ENDPOINT_DATABASE[] = []
  public Vars_names: string[] = [];
  public vars!: AllVar[];

  /**
   * 
   */
  getVariables() {
    this.varsService.getAllVars().subscribe((vars) => {
      this.vars = vars;
      this.Vars_names = vars.map((vars) => {
        return vars.name;
      })
    });
    this.varsService.getAllVarsJson().subscribe((variables) => {
      this.jsonVariables = variables.json;
      // this.modbusVariables = variables.modbus;
      variables.json.forEach((variable, idx) => {
        this.jsonBuilder.doQuery(variable)
          .then((value) => {
            this.jsonVariables[idx].value = value;
          })
          .catch((err) => {
            console.log("Error al realizar la peticion: ", err)
          })
      })
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })
    this.varsService.getAllVarsModbus().subscribe((variables_modbus) => {
      this.modbusVariables = variables_modbus;
    }, (err: HttpErrorResponse) => {
      // this.alertService.setMessageAlert(err.message);
      console.log(err.message)
    })
    this.varsService.getAllVarsMemory().subscribe((variables_memoria) => {
      if (variables_memoria.length > 0) {
        this.getNextResultMemoryVar(variables_memoria, 0, variables_memoria.length)
      }
    }, (err) => {
      this.alertService.setMessageAlert("error al recibir las variables de memoria");
      console.log(err.message)
    })

    this.cma_endpointService.getAll_endpoints().subscribe((variables_cma_endpoints) => {
      this.variablesEndpoint = variables_cma_endpoints;
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.alertService.setMessageAlert("Error al recibir las variables CMA endpoint");
    })
  }






  /**
   * 
   * @param vars 
   * @param id 
   * @param size 
   */
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







  /**
   * 
   */
  refreshData() {
    this.getVariables();
  }







  public showDatos: boolean = false;
  public showSeguridad: boolean = false;
  public showSeleccion: boolean = false;
  /**
  * Funcion para cambiar el estado de la variable menu que permite regresar, crear o refrescar las vars de la pagina principal
  * @param menu 
  */
  public menu: number = 1;
  changeStatusMenu(menu: number) {
    this.menu = menu;
  }







  /**
   * Funcion para cambiar el status del menu de creacion de variable
   * @param idx 
  */
  public menuTypeVar: number = 1;
  changeStatusTypeCreateVar(idx: number) {
    this.menuTypeVar = idx;
  }







  /**
   * 
   */
  changeModbusInput() {
    this.modbus_connection_value = null;
  }









  public modbus_connection_value: any;
  /**
   * 
   * @param name 
   * @param ip 
   * @param port 
   * @param no_register 
   */
  testModbusVar(name: string, ip: string, port: string, no_register: string) {
    if (!this.modbus_connection_value) {
      this.modbusBuilder.testConnection(ip, port, no_register);
      this.modbusBuilder.output_modbus_get_value.subscribe((value) => {
        this.modbus_connection_value = value.message;
      })
    } else {
      const enableName = this.Vars_names.indexOf(name);
      if (enableName !== -1) {
        this.alertService.setMessageAlert("Nombre repetido, cambia el nombre de la variable.");
      } else {
        this.modbusBuilder.createVariable(name, ip, port, no_register);
      }
    }
  }






  public regex = new CalculatorExpression(this.varsService);
  /**
   * 
   * @param name 
   * @param expression 
   */
  guardarExpression(name: string, expression: string) {
    if (name.length > 0 && expression.length > 0) {
      this.regex.parserRegexVars(expression, this.vars, this.Vars_names, this.jsonBuilder)
        .then(() => {
          this.varsService.create_memory_var(name, expression).subscribe(() => {
            this.alertService.setMessageAlert("Variable de memoria guardada.");
            this.menu = 1;
            this.getVariables();
          }, (err: HttpErrorResponse) => {
            alert(err.message);
            this.alertService.setMessageAlert("Error al guardar la variable de memoria, intentelo mas tarde.");
          })
        })
        .catch((err) => {
          this.alertService.setMessageAlert(err);
        })
    } else {
      this.alertService.setMessageAlert("No puedes dejar espacios vacios.");
    }
  }


  /**
   * 
   * @param textArea 
   * @param name 
   */
  addVar(textArea: HTMLTextAreaElement, name: string) {
    const textoActual = textArea.value;
    const selectEnd = textArea.selectionEnd;
    var nuevoTexto = textoActual.slice(0, selectEnd) + "{" + name + "}" + textoActual.slice(selectEnd);
    textArea.value = nuevoTexto;
  }


  //---------------------------------------------------------------------------------------------
  //////////////////////Funciones para las variables endpoint////////////////////////////////////


  public modeCMA_ENPOINT_option = 1;
  public cma_endpoint_created!: ICMA_ENDPOINT_CREATE_RESPONSE;
  /**
   * 
   */
  createEndpointVar(name: string, description: string) {
    if ((name.length > 0 && name.length < 50)) {
      if ((description.length > 0)) {
        this.cma_endpointService.create_endpoint({ name, description }).subscribe((data) => {
          this.cma_endpoint_created = data;
          this.modeCMA_ENPOINT_option = 2;
          this.alertService.setMessageAlert("Endpoint creado con exito");
        }, (err: HttpErrorResponse) => {
          console.log(err);
          if (err.status == 409) {
            this.alertService.setMessageAlert("Nombre duplicado, no se creo el endpoint.");
          } else {
            this.alertService.setMessageAlert("No se pudo crear el endpoint, intentelo de nuevo mas tarde.");
          }
        })
      } else {
        this.alertService.setMessageAlert("No haz definido una descripcion para el endpoint.")
      }
    } else {
      if (name.length >= 50) {
        this.alertService.setMessageAlert("El nombre es demasiado largo");
      } else {
        this.alertService.setMessageAlert("no haz definido un nombre.");
      }
    }
  }



  
}

