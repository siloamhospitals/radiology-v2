import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageModalityMaintenanceComponent } from './page-modality-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: PageModalityMaintenanceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageSwabListRoutingModule { }
