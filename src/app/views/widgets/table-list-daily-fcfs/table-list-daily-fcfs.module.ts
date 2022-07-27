import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListDailyFcfsComponent } from './table-list-daily-fcfs.component';
import { LoadingModule } from '../widget-loading/widget-loading.module';

@NgModule({
  declarations: [TableListDailyFcfsComponent],
  imports: [
    CommonModule,
    LoadingModule
  ],
  exports: [
    TableListDailyFcfsComponent
  ]
})
export class TableListDailyFcfsModule { }
