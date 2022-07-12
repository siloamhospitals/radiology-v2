import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalChangePasswordComponent } from './modal-change-password.component';

@NgModule({
  declarations: [
    ModalChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
  ],
  exports: [
    ModalChangePasswordComponent
  ]
})
export class ModalChangePasswordModule { }
