import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageWorklistComponent } from './page-worklist.component';

const routes: Routes = [
  {
    path: '',
    component: PageWorklistComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageWorklistRoutingModule { }
