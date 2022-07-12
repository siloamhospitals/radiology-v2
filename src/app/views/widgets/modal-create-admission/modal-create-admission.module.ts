import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCreateAdmissionComponent } from './modal-create-admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from '../date-picker/date-picker.module';

@NgModule({
  declarations: [
    ModalCreateAdmissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatepickerModule
  ],
  exports: [
    ModalCreateAdmissionComponent,
  ]
})
export class ModalCreateAdmissionModule { }
