import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmDeleteModule } from '../modal-confirm-delete/modal-confirm-delete.module';
import { ModalModalityComponent } from './modal-modality.component';


@NgModule({
  declarations: [
    ModalModalityComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    ModalConfirmDeleteModule
  ],
  exports: [
    ModalModalityComponent,
  ],
  entryComponents: [
    ModalModalityComponent
    ]
})
export class ModalModalityentModule { }
