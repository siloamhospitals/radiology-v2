import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './date-picker.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule
  ],
  exports: [
    DatepickerComponent
  ]
})
export class DatepickerModule { }
