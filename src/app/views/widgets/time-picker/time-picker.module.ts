import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimepickerComponent } from './time-picker.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TimepickerComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TimepickerComponent
  ]
})
export class TimepickerModule { }
