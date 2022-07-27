import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalNewPatientComponent } from './modal-new-patient.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';
import { LoadingModule } from '../widget-loading/widget-loading.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ModalNewPatientComponent],
  imports: [
    CommonModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    DatepickerModule,
    TimepickerModule,
    LoadingModule,
    NgxMaskModule.forRoot(),
  ]
})
export class ModalNewPatientModule { }
