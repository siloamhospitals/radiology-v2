import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownExaminationComponent } from './dropdown-examination.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [DropdownExaminationComponent],
  imports: [
    CommonModule,
    AutocompleteLibModule
  ],
  bootstrap: [
    DropdownExaminationComponent
  ],
  exports: [
    DropdownExaminationComponent
  ]
})
export class DropdownExaminationModule { }
