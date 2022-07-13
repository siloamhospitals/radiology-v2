import { ModalCancelAppointmentModule } from './../../widgets/modal-cancel-appointment/modal-cancel-appointment.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRadiologyScheduleComponent } from './page-radiology-schedule.component';

import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageRadiologyScheduleRoutingModule } from './page-radiology-schedule-routing.module';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from '../../widgets/date-picker/date-picker.module';
import { TimepickerModule } from '../../widgets/time-picker/time-picker.module'
import { ModalHistoryComponentModule } from '../../widgets/modal-history/modal-history.module';
import { ModalHistoryComponent } from '../../widgets/modal-history/modal-history.component';
import { ModalCancelAppointmentComponent } from '../../widgets/modal-cancel-appointment/modal-cancel-appointment.component';
import { ModalCreateAdmissionComponent } from '../../widgets/modal-create-admission/modal-create-admission.component';
import { ModalCreateAdmissionModule } from '../../widgets/modal-create-admission/modal-create-admission.module';
import { ModalDetailScheduleModule } from '../../widgets/modal-detail-schedule/modal-detail-schedule.module';
import { ModalDetailScheduleComponent } from '../../widgets/modal-detail-schedule/modal-detail-schedule.component';
import { TableListWeeklyModule } from '../../widgets/table-list-weekly/table-list-weekly.module';
import { TableListMonthlyModule } from '../../widgets/table-list-monthly/table-list-monthly.module';
import { TableListDailyModule } from '../../widgets/table-list-daily/table-list-daily.module';

@NgModule({
  declarations: [PageRadiologyScheduleComponent],
  imports: [
    ModalHistoryComponentModule,
    CommonModule,
    PageRadiologyScheduleRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    FormsModule,
    DatepickerModule,
    TimepickerModule,
    ModalCancelAppointmentModule,
    ModalCreateAdmissionModule,
    ModalDetailScheduleModule,
    TableListDailyModule,
    TableListWeeklyModule,
    TableListMonthlyModule,
  ],
  exports: [
    PageRadiologyScheduleComponent
  ],
  entryComponents: [
    ModalHistoryComponent,
    ModalCancelAppointmentComponent,
    ModalCreateAdmissionComponent,
    ModalDetailScheduleComponent
  ],
})
export class PageRadiologyScheduleModule {}
