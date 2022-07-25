import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalHistoryComponent } from './modal-history.component';
import { LoadingModule } from '../widget-loading/widget-loading.module';

@NgModule({
  declarations: [
    ModalHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    LoadingModule
  ],
  exports: [
    ModalHistoryComponent
  ]
})
export class ModalHistoryComponentModule { }
