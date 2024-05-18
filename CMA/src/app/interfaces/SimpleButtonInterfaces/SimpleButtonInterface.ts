
/**
 * Interfaz utilizada para capturar los datos de configuracion de un boton simple
 */
export interface ISimpleButtonConfiguration{
   title: string,
   description: string,
   idVariableJson: number| null,
   idVariableModbus: number| null,
   background_color: string,
   text_color: string,
   style_button: "normal"|"circle"
}



export interface ISimpleButtonDatabase{
   idsimplebutton: number,
   title: string,
   description: string,
   idvariablejson: number| null,
   idvariablemodbus: number| null,
   background_color: string,
   text_color: string,
   style_button: "normal"|"circle",
   x: number,
   y: number,
   width: number,
   height: number,
}