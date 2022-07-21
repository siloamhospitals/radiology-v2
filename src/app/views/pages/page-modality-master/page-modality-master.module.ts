import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageSwabListRoutingModule } from './page-modality-master-routing.module';
import { PageModalityMasterComponent } from './page-modality-master.component';

import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
/* import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7'; */
import { RouterModule } from '@angular/router';
import { ModalModalityentModule } from '../../widgets/modal-modality/modal-modality.module';
import { ModalModalityComponent } from '../../widgets/modal-modality/modal-modality.component';

@NgModule({
  declarations: [
    PageModalityMasterComponent
  ],
  imports: [
    //NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageSwabListRoutingModule,
    SectionHeaderModule,
    SectionSidebarModule,
    SectionFooterModule,
    TextMaskModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbModalModule,
    AutocompleteLibModule,
    NguiAutoCompleteModule,
    ModalModalityentModule,
    RouterModule,
    NgbDatepickerModule
  ],
  exports: [
    PageModalityMasterComponent
  ],
  entryComponents: [
    ModalModalityComponent
  ],
  bootstrap: [PageModalityMasterComponent]
})
export class PageModalityMasterModule { }
