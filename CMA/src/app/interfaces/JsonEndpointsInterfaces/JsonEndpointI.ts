
export interface IJsonBodyVariable_Constructor {
    key: string;
    value: any;
}

export interface IJsonVariable_Create{

    name:string;
    url:string;
    method:string;
    body_json:Object; //Esto se llama body en la base de datos //arreglo de objetos
    token_bearer:string|undefined;
    key_json:string;
    father_keys_json_array:string[]; //arreglo de string
}

export interface IJsonVariable{
    idjsonvar: number;
    name:string;
    url:string;
    method:string;
    body:Object; //Esto se llama body en la base de datos //arreglo de objetos
    token_bearer:string|undefined;
    key_json:string;
    father_keys_json_array:string[]; //arreglo de string
    value: any;
}

