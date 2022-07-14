import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCreateAppointmentComponent } from './modal-create-appointment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';

@NgModule({
  declarations: [ModalCreateAppointmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatepickerModule,
    TimepickerModule
  ]
})
export class ModalCreateAppointmentModule { }
