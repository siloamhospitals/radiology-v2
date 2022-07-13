import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListWeeklyComponent } from './table-list-weekly.component';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';

@NgModule({
  declarations: [TableListWeeklyComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TableListWeeklyComponent,
    FormsModule,
    DatepickerModule,
    TimepickerModule,
  ]
})
export class TableListWeeklyModule { }
