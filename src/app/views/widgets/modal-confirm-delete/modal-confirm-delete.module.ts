import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalConfirmDeleteComponent } from './modal-confirm-delete.component';

@NgModule({
  declarations: [
    ModalConfirmDeleteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalConfirmDeleteComponent
  ]
})
export class ModalConfirmDeleteModule { }
