import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDetailScheduleComponent } from './modal-detail-schedule.component';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';

@NgModule({
  declarations: [ModalDetailScheduleComponent],
  imports: [
    CommonModule,
    DatepickerModule,
    TimepickerModule
  ]
})
export class ModalDetailScheduleModule { }
