import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SectionHeaderComponent } from './section-header.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangePasswordComponent } from './../../widgets/modal-change-password/modal-change-password.component';
import { ModalChangePasswordModule } from '../../widgets/modal-change-password/modal-change-password.module';

@NgModule({
  declarations: [SectionHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    ModalChangePasswordModule
  ],
  exports: [SectionHeaderComponent],
  entryComponents: [
    ModalChangePasswordComponent
  ],
})
export class SectionHeaderModule { }
