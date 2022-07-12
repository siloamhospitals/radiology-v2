import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { PageModalityMasterComponent } from './page-modality-master.component';

@NgModule({
  declarations: [PageModalityMasterComponent],
  imports: [
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule
  ],
  exports: [
    PageModalityMasterComponent
  ]
})
export class PageModalityMasterModule { }
