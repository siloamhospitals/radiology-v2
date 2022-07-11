import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRadiologyScheduleComponent } from './page-radiology-schedule.component';

import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageRadiologyScheduleRoutingModule } from './page-radiology-schedule-routing.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PageRadiologyScheduleComponent],
  imports: [
    CommonModule,
    PageRadiologyScheduleRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgbDatepickerModule
  ],
  exports: [
    PageRadiologyScheduleComponent
  ]
})
export class PageRadiologyScheduleModule { }
