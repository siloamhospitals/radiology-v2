import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';

import { ModalityTabComponent } from './widget-modality-tab.component';

@NgModule({
  declarations: [
    ModalityTabComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalityTabComponent
  ]
})
export class ModalityTabModule { }
