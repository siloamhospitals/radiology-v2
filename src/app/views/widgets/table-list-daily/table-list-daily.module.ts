import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListDailyComponent } from './table-list-daily.component';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';
import { LoadingComponent } from '../widget-loading/widget-loading.component';
import { LoadingModule } from '../widget-loading/widget-loading.module';

@NgModule({
  declarations: [TableListDailyComponent],
  imports: [
    CommonModule,
    FormsModule,
    DatepickerModule,
    TimepickerModule,
    LoadingModule
  ],
  exports: [
    TableListDailyComponent,
    LoadingComponent
  ]
})
export class TableListDailyModule { }
