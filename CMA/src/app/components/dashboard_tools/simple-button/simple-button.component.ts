import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { JsonVariableClass } from 'src/app/functions/json_functions';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { ISimpleButtonDatabase } from 'src/app/interfaces/SimpleButtonInterfaces/SimpleButtonInterface';
import { AlertService } from 'src/app/service/alert.service';
import { AllService } from 'src/app/service/all.service';
import { SimpleButtonService } from 'src/app/service/simple_button_service';
import { VarsService } from 'src/app/service/vars';

@Component({
  selector: 'app-simple-button',
  templateUrl: './simple-button.component.html',
  styleUrls: ['./simple-button.component.scss']
})
export class SimpleButtonComponent implements OnChanges, AfterViewInit {

  @ViewChild('button') button!: ElementRef<HTMLDivElement>;
  public button_container!: HTMLDivElement;
  @Input() idSimpleButton!: number;

  //Se define la variable que define los datos que se van a capturar
  public jsonBuilder = new JsonVariableClass(this.varsService, this.alert);

  
  constructor(
    private all: AllService,
    private alert: AlertService,
    private varsService: VarsService,
    private simpleButtonService: SimpleButtonService) {
    
  }

  ngAfterViewInit(): void {
    if (this.button) {
      this.button_container = this.button.nativeElement; 
    }
  }


  public simpleButton!: ISimpleButtonDatabase;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      //Realizar peticion de cambios
      this.simpleButtonService.getOneById_SimpleButton(this.idSimpleButton).subscribe((simpleButton) => {
        this.simpleButton = simpleButton[0];
        this.setChangesButton(this.button_container);
      })
    }
  }



  setChangesButton(button: HTMLDivElement) {
    if (this.simpleButton.style_button == "circle") {
  
      const style = `
      color: ${this.simpleButton.text_color};
      background-color: ${this.simpleButton.background_color};
      border-radius: 50%;
      height: 100%;
      width: 100%;
      `;
      button.setAttribute("style", style);
    } else {
      const style = `
      color: ${this.simpleButton.text_color};
      background-color: ${this.simpleButton.background_color};
      border-radius: 5px;
      `;
      button.setAttribute("style", style);
    }
  }

  clickEvent() {
    if (this.simpleButton.idvariablejson) {
      //Realizar la peticion de jsonendpoint
      this.varsService.getJsonVarById(this.simpleButton.idvariablejson).subscribe((variable) => {
        
        this.jsonBuilder.doQuery(variable[0])
          .then((data) => {
            this.alert.setMessageAlert("Exito");
          })
          .catch((err) => {
            this.alert.setMessageAlert(err);
          })
      })
    } else if (this.simpleButton.idvariablemodbus) {
      //Realizar la peticion de modbusendpoint

    } else {
      this.alert.setMessageAlert("No se ha seleccionado ninguna variable.")
    }
  }
}
