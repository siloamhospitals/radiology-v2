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

@NgModule({
  declarations: [PageRadiologyScheduleComponent],
  imports: [
    CommonModule,
    PageRadiologyScheduleRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    FormsModule,
    DatepickerModule,
    TimepickerModule
  ],
  exports: [
    PageRadiologyScheduleComponent
  ]
})
export class PageRadiologyScheduleModule { }
