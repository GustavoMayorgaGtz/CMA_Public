import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlobDataRoutingModule } from './blobdata-routing.module';
import { BlobdataComponent } from './blobdata.component';
import { ComponentModule } from "../../components/component.module";
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
    declarations: [BlobdataComponent,
      
    ],
    imports: [
        CommonModule,
        BlobDataRoutingModule,
        ComponentModule,
        NgApexchartsModule,
        NgChartsModule
    ]
})
export class BlobdataModule { }
