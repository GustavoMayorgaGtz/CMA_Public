import { AbstractControl, FormGroup } from "@angular/forms"

//Interface para manejar los formularios entre otros de LOGIN
export interface login {
    nombre_usuario: string,
    password: string
}

// export interface register {
//     nombre_usuario: string,
//     correo: string,
//     password: string,
//     telefono: string
// }

export interface loginBuilder extends FormGroup {
    value: login,
    controls: {
        nombre_usuario: AbstractControl<string>,
        password: AbstractControl<string>
    }
}

//Interface para manejar los formularios entre otros de REGISTER USER
export interface register {
    nombre_usuario: string,
    correo: string,
    password: string,
    telefono: string
}

export interface registerBuilder extends FormGroup {
    value: register,
    controls: {
        nombre_usuario: AbstractControl<string>,
        correo: AbstractControl<string>,
        password: AbstractControl<string>,
        telefono: AbstractControl<string>
    }
}

export interface IUser {
    idUsuario: number,
    nombre: string,
    correo: string,
    telefono: string,
    rango: 'Admin' | 'Usuario'
}