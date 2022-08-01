import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetPatientDataComponent } from './widget-patient-data.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [WidgetPatientDataComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    AutocompleteLibModule
  ],
  exports: [
    WidgetPatientDataComponent,
  ]
})
export class WidgetPatientDataModule { }
