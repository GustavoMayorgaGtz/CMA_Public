import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loginBuilder, registerBuilder } from 'src/app/interfaces/LoginInterface/login.interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  public showInformationMenu: number = 1;
  public isLogin = true;
  public loginGroup!: loginBuilder;
  public registerGroup!: registerBuilder;

  constructor(
    private builder: FormBuilder
    , private servicios: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginGroup = this.builder.group({
      nombre_usuario: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }) as loginBuilder;

    this.registerGroup = this.builder.group({
      nombre_usuario: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
    }) as registerBuilder;

    setInterval(() => {
       if(this.showInformationMenu == 6){
        this.showInformationMenu = 1;
       }else{
           this.showInformationMenu++;
       }
    }, 10000);
  }
 


  public isLoadingRegister: boolean = true;
  changeLogin_Status() {
    this.isLogin = !this.isLogin;
  }

  loggear() {
    if (this.loginGroup.valid) {
      const username = this.loginGroup.controls.nombre_usuario.value;
      const password = this.loginGroup.controls.password.value;
      this.servicios.login_user({ nombre_usuario: username, password }).subscribe((res) => {
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("idUser", res.user.toString());
        console.log("datos de logeo ", res);
        if(res){
          this.router.navigate(['/dashboard'])
        }else{
          this.alertService.setMessageAlert("Datos incorrectos, vuelve a intentarlo")
        }
      }, (err: HttpErrorResponse) => {
        if(err.status == 401){
          this.alertService.setMessageAlert("Datos incorrectos, vuelve a intentarlo")
        }else{
          this.alertService.setMessageAlert("No se pudo iniciar sesion, intentalo despues.")
        }
      })
    } else {
      alert("Llena todos los campos");
    }
  }

  register() {
    if (this.registerGroup.valid) {
      this.isLoadingRegister = false;
      const nombre_usuario = this.registerGroup.controls.nombre_usuario.value;
      const correo = this.registerGroup.controls.correo.value;
      const password = this.registerGroup.controls.password.value;
      const telefono = this.registerGroup.controls.telefono.value;
      this.servicios.register_user({ nombre_usuario, telefono, correo, password }).subscribe((res) => {
        this.isLoadingRegister = true;
        this.alertService.setMessageAlert("Usuario registrado");
        this.isLogin = true;
      }, (err: HttpErrorResponse) => {
        this.isLoadingRegister = true;
        this.alertService.setMessageAlert("No se pudo registrar el usuario. err: "+ err.message);
        
      })
    } else {
      if (this.registerGroup.controls.correo.valid) {
        alert("Llena todos los campos")
      } else {
        alert("Correo electronico no valido.")
      }
    }
  }
}
