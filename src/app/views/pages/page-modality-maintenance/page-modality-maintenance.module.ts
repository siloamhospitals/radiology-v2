import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { SectionFooterModule } from '../../sections/section-footer/section-footer.module';
import { PageSwabListRoutingModule } from './page-modality-maintenance-routing.module';
import { PageModalityMaintenanceComponent } from './page-modality-maintenance.component';

import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule, NgbModalModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { RouterModule } from '@angular/router';
import { ModalMaintenanceModule } from '../../widgets/modal-maintenance/modal-maintenance.module';
import { ModalMaintenanceComponent } from '../../widgets/modal-maintenance/modal-maintenance.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalConfirmDeleteComponent } from '../../widgets/modal-confirm-delete/modal-confirm-delete.component';
import { ModalConfirmDeleteModule } from '../../widgets/modal-confirm-delete/modal-confirm-delete.module';
import { ModalityTabModule } from '../../widgets/widget-modality-tab/widget-modality-tab.module';
import { ModalityTabComponent } from '../../widgets/widget-modality-tab/widget-modality-tab.component';

@NgModule({
  declarations: [
    PageModalityMaintenanceComponent
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
    ModalMaintenanceModule,
    RouterModule,
    NgbDatepickerModule,
    NgSelectModule,
    ModalConfirmDeleteModule,
    ModalityTabModule
  ],
  exports: [
    PageModalityMaintenanceComponent
  ],
  entryComponents: [
    ModalMaintenanceComponent,
    ModalConfirmDeleteComponent,
    ModalityTabComponent
  ],
  bootstrap: [PageModalityMaintenanceComponent]
})
export class PageModalityMaintenanceModule { }
