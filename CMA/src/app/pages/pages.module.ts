import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { ComponentModule } from '../components/component.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentModule
  ],
  
})
export class PagesModule { }
