import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListWeeklyComponent } from './table-list-weekly.component';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';
import { LoadingModule } from '../widget-loading/widget-loading.module';

@NgModule({
  declarations: [TableListWeeklyComponent],
  imports: [
    CommonModule,
    FormsModule,
    DatepickerModule,
    TimepickerModule,
    LoadingModule,
  ],
  exports: [
    TableListWeeklyComponent,
  ]
})
export class TableListWeeklyModule { }
