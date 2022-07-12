import { ModalCancelAppointmentModule } from './../../widgets/modal-cancel-appointment/modal-cancel-appointment.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRadiologyScheduleComponent } from './page-radiology-schedule.component';

import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageRadiologyScheduleRoutingModule } from './page-radiology-schedule-routing.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';
import { ModalCancelAppointmentComponent } from '../../widgets/modal-cancel-appointment/modal-cancel-appointment.component';
import { ModalCreateAdmissionComponent } from '../../widgets/modal-create-admission/modal-create-admission.component';
import { ModalCreateAdmissionModule } from '../../widgets/modal-create-admission/modal-create-admission.module';
import { ModalDetailScheduleModule } from '../../widgets/modal-detail-schedule/modal-detail-schedule.module';
import { ModalDetailScheduleComponent } from '../../widgets/modal-detail-schedule/modal-detail-schedule.component';

@NgModule({
  declarations: [PageRadiologyScheduleComponent],
  imports: [
    CommonModule,
    PageRadiologyScheduleRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    ModalCancelAppointmentModule,
    ModalCreateAdmissionModule,
    ModalDetailScheduleModule
  ],
  exports: [
    PageRadiologyScheduleComponent
  ],
  entryComponents: [
    ModalCancelAppointmentComponent,
    ModalCreateAdmissionComponent,
    ModalDetailScheduleComponent
  ],
})
export class PageRadiologyScheduleModule { }
