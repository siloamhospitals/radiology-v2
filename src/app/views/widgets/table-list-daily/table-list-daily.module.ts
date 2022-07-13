import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListDailyComponent } from './table-list-daily.component';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';

@NgModule({
  declarations: [TableListDailyComponent],
  imports: [
    CommonModule,
    FormsModule,
    DatepickerModule,
    TimepickerModule,
  ],
  exports: [
    TableListDailyComponent
  ]
})
export class TableListDailyModule { }
