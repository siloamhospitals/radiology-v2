import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalQueueNumberComponent } from './modal-queue-number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbAlertModule, NgbModalModule, NgbPopoverModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ModalQueueNumberComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule, 
    NgbModalModule, 
    NgbPopoverModule, 
    NgbProgressbarModule,
    NgxMaskModule.forRoot()
  ]
})
export class ModalQueueNumberModule { }
