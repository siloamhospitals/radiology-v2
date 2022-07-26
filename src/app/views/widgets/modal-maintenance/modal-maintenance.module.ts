import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import { ModalMaintenanceComponent } from './modal-maintenance.component';
import { DatepickerModule } from '../date-picker/date-picker.module';
import { TimepickerModule } from '../time-picker/time-picker.module';

@NgModule({
  declarations: [
    ModalMaintenanceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    DatepickerModule,
    TimepickerModule
    
  ],
  exports: [
    ModalMaintenanceComponent,
  ],
  entryComponents: [
    ModalMaintenanceComponent,
    ModalConfirmDeleteComponent
  ]
})
export class ModalMaintenanceModule { }
