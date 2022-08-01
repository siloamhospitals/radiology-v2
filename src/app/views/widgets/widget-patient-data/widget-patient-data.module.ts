import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetPatientDataComponent } from './widget-patient-data.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [WidgetPatientDataComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbAlertModule,
    AutocompleteLibModule,
  ],
  exports: [
    WidgetPatientDataComponent,
  ]
})
export class WidgetPatientDataModule { }
