import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCreateAdmissionComponent } from './modal-create-admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { LoadingModule } from '../../widgets/widget-loading/widget-loading.module';

@NgModule({
  declarations: [
    ModalCreateAdmissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    DatepickerModule,
    TimepickerModule,
    NgSelectModule,
    LoadingModule,
    AutocompleteLibModule
  ],
  exports: [
    ModalCreateAdmissionComponent,
  ]
})
export class ModalCreateAdmissionModule { }
