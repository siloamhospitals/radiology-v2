import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListMonthlyComponent } from './table-list-monthly.component';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';
import { LoadingModule } from '../widget-loading/widget-loading.module';

@NgModule({
  declarations: [TableListMonthlyComponent],
  imports: [
    CommonModule,
    FormsModule,
    DatepickerModule,
    TimepickerModule,
    LoadingModule,
  ],
  exports: [
    TableListMonthlyComponent
  ]
})
export class TableListMonthlyModule { }
