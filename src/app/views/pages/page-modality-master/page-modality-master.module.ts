import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageSwabListRoutingModule } from './page-modality-master-routing.module';
import { PageModalityMasterComponent } from './page-modality-master.component';
import { WidgetSwabListComponent } from '../../widgets/widget-swab-list/widget-swab-list.component';
import { MyDatePickerModule } from 'mydatepicker';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ModalModalityComponentModule, ModalModalityentModule } from '../../widgets/modal-modality/modal-modality.module';
import { ModalModalityComponent } from '../../widgets/modal-modality/modal-modality.component';

@NgModule({
  declarations: [
    PageModalityMasterComponent,
    WidgetSwabListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageSwabListRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    MyDatePickerModule,
    MyDateRangePickerModule,
    NgbDatepickerModule,
    TextMaskModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbModalModule,
    AutocompleteLibModule,
    NguiAutoCompleteModule,
    ModalModalityentModule
  ],
  exports: [
    PageModalityMasterComponent,
  ],
  entryComponents: [
    ModalModalityComponent
  ]
})
export class PageModalityMasterModule { }
