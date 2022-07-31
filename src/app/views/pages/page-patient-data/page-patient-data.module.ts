import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagePatientDataComponent } from './page-patient-data.component';
import { PagePatientDataRoutingModule } from './page-patient-data-routing.module';

@NgModule({
  declarations: [PagePatientDataComponent],
  imports: [
    CommonModule,
    PagePatientDataRoutingModule
  ]
})
export class PagePatientDataModule { }
