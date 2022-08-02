import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';
import { PageWorklistComponent } from './page-worklist.component';
import { PageWorklistRoutingModule } from './page-worklist-routing.module';

@NgModule({
  declarations: [PageWorklistComponent],
  imports: [
    CommonModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    PageWorklistRoutingModule
  ],
  exports: [
    PageWorklistComponent
  ]
})
export class PageWorklistModule { }
