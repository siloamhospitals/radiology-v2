import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalityTabComponent } from './widget-modality-tab.component';

@NgModule({
  declarations: [
    ModalityTabComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalityTabComponent
  ]
})
export class ModalityTabModule { }
