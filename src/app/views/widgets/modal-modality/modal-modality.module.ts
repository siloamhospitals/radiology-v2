import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import { ModalModalityComponent } from './modal-modality.component';


@NgModule({
  declarations: [
    ModalModalityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
  ],
  exports: [
    ModalModalityComponent,
  ],
  entryComponents: [ModalModalityComponent,
    ModalConfirmDeleteComponent]
})
export class ModalModalityentModule { }
