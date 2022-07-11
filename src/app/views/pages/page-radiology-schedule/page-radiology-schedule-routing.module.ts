import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageRadiologyScheduleComponent } from './page-radiology-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: PageRadiologyScheduleComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRadiologyScheduleRoutingModule { }
