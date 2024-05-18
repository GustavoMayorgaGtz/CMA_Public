import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlobdataComponent } from './blobdata.component';


const routes: Routes = [
  {
    path: "",
    component:BlobdataComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlobDataRoutingModule { }
