import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCreateAppointmentComponent } from './modal-create-appointment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ModalCreateAppointmentComponent],
  imports: [
    CommonModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    DatepickerModule,
    TimepickerModule,
    NgxMaskModule.forRoot()
  ]
})
export class ModalCreateAppointmentModule { }
