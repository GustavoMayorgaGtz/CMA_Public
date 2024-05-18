import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () => import("./home/home.module").then(m => m.HomeModule)
  },
  {
    path: "login",
    loadChildren: () => import("./login/login.module").then(m => m.LoginModule)
  },
  {
    path: "blobdata",
    loadChildren: () => import("./blobdata/blobdata.module").then((m) => m.BlobdataModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
