import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCreateAdmissionComponent } from './modal-create-admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModalCreateAdmissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalCreateAdmissionComponent
  ]
})
export class ModalCreateAdmissionModule { }
