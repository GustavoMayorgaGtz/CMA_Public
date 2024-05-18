import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  constructor(){
    const saved_option = localStorage.getItem("menu_number");
    if(saved_option){
      this.optionEnable = parseInt(saved_option);
    }else{
      this.optionEnable = 1;
    }
  }

  
  public optionEnable: number = 3;
  /**
   * Funcion para cambiar la vista del menu
   */
  setOptionEnable(opcion: number){
    localStorage.setItem("menu_number", opcion.toString())
    this.optionEnable = opcion;
  }
}
