import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDetailScheduleComponent } from './modal-detail-schedule.component';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalDetailScheduleComponent],
  imports: [
    CommonModule,
    DatepickerModule,
    TimepickerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ModalDetailScheduleModule { }
