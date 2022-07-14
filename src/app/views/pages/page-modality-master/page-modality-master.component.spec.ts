import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeaderModule } from '../../sections/section-header/section-header.module';
import { SectionSidebarModule } from '../../sections/section-sidebar/section-sidebar.module';
import { PageSwabListComponent } from './page-swab-list.component';
import { WidgetSwabListComponent } from '../../widgets/widget-swab-list/widget-swab-list.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';


describe('PageSwabListComponent', () => {
  let component: PageSwabListComponent;
  let fixture: ComponentFixture<PageSwabListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSwabListComponent, WidgetSwabListComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        NgbModule,
        TextMaskModule,
        MyDateRangePickerModule,
        SectionHeaderModule,
        SectionSidebarModule,
        AutocompleteLibModule,
        NguiAutoCompleteModule,
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // tslint:disable-next-line:max-line-length
    spyOn(window.localStorage, 'getItem').and.returnValue(`{"user":{"id":"da8a3656-5eeb-4f87-80c8-f9ea9d6c3acd","username":"albert.aswindra","fullname":"albert aswindra"},"hospital":{"id":"39764039-37b9-4176-a025-ef7b2e124ba4","orgId":2,"name":"Siloam Hospitals Lippo Village","alias":"SHLV","zone":7,"isBpjs":true,"isBridging":true},"collection":[{"id":"39764039-37b9-4176-a025-ef7b2e124ba4","orgId":2,"name":"Siloam Hospitals Lippo Village","alias":"SHLV","zone":7,"isBpjs":true,"isBridging":true}]}`);
    fixture = TestBed.createComponent(PageSwabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
