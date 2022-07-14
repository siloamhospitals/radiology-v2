import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalConfirmDeleteComponent } from './modal-confirm-delete.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ModalConfirmDeleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
  ],
  entryComponents: [
    ModalConfirmDeleteComponent
  ],
  exports: [ModalConfirmDeleteComponent]
})
export class ModalConfirmDeleteModule {}
