import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageModalityMasterComponent } from './page-modality-master.component';

const routes: Routes = [
  {
    path: '',
    component: PageModalityMasterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageSwabListRoutingModule { }
