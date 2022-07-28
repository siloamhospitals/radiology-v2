import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLoadingComponent } from './modal-loading.component';
import { LoadingModule } from '../widget-loading/widget-loading.module';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ModalLoadingComponent],
  imports: [
    CommonModule,
    LoadingModule,
    FormsModule,
    NgbTooltipModule,
  ],
  exports: [
    ModalLoadingComponent
  ]
})
export class ModalLoadingModule { }
