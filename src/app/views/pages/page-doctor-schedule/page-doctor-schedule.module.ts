import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';
import { PageDoctorScheduleComponent } from './page-doctor-schedule.component';
import { PageDoctorScheduleRoutingModule } from './page-doctor-schedule-routing.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

@NgModule({
  declarations: [PageDoctorScheduleComponent],
  imports: [
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    PageDoctorScheduleRoutingModule,
    NguiAutoCompleteModule
  ],
  exports: [
    PageDoctorScheduleComponent

  ]
})
export class PageDoctorScheduleModule { }
