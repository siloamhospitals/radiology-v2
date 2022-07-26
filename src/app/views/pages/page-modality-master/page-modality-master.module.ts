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
import { RouterModule } from '@angular/router';
import { ModalModalityModule } from '../../widgets/modal-modality/modal-modality.module';
import { ModalModalityComponent } from '../../widgets/modal-modality/modal-modality.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalConfirmDeleteComponent } from '../../widgets/modal-confirm-delete/modal-confirm-delete.component';
import { ModalConfirmDeleteModule } from '../../widgets/modal-confirm-delete/modal-confirm-delete.module';
import { ModalityTabModule } from '../../widgets/widget-modality-tab/widget-modality-tab.module';
import { ModalityTabComponent } from '../../widgets/widget-modality-tab/widget-modality-tab.component';

@NgModule({
  declarations: [
    PageModalityMasterComponent
  ],
  imports: [
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
    ModalModalityModule,
    RouterModule,
    NgbDatepickerModule,
    NgSelectModule,
    ModalConfirmDeleteModule,
    ModalityTabModule
  ],
  exports: [
    PageModalityMasterComponent
  ],
  entryComponents: [
    ModalModalityComponent,
    ModalConfirmDeleteComponent,
    ModalityTabComponent
  ],
  bootstrap: [PageModalityMasterComponent]
})
export class PageModalityMasterModule { }
