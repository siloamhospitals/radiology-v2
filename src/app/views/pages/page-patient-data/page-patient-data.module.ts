import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagePatientDataComponent } from './page-patient-data.component';
import { PagePatientDataRoutingModule } from './page-patient-data-routing.module';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';

@NgModule({
  declarations: [PagePatientDataComponent],
  imports: [
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    PagePatientDataRoutingModule
  ]
})
export class PagePatientDataModule { }
