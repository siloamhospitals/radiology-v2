import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalHistoryComponent } from './modal-history.component';

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
  ], exports: [
    ModalHistoryComponent
  ]
})
export class ModalHistoryComponentModule { }
