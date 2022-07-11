import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WidgetSwabListComponent } from './widget-swab-list.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule,  NgbModalModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { DebugElement } from '@angular/core';
import { appointmentResponse } from '../../../mocks/appointment-checkup-swab';
import { of } from 'rxjs';
import { inputTextChangeAndEnter, selectBoxChange, updateData } from './widget-swab-list-test.util';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, _reject) => resolve('x'));
}

describe('WidgetSwabListComponent', () => {
  let component: WidgetSwabListComponent;
  let fixture: ComponentFixture<WidgetSwabListComponent>;
  let de: DebugElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ WidgetSwabListComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        CommonModule,
        MyDateRangePickerModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        NgbAlertModule,
        NgbPopoverModule,
        NgbProgressbarModule,
        NgbModalModule,
        NgbDatepickerModule,
        AutocompleteLibModule,
        NguiAutoCompleteModule,
        NgbModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // tslint:disable-next-line:max-line-length
    spyOn(window.localStorage, 'getItem').and.returnValue(`{"user":{"id":"da8a3656-5eeb-4f87-80c8-f9ea9d6c3acd","username":"albert.aswindra","fullname":"albert aswindra"},"hospital":{"id":"39764039-37b9-4176-a025-ef7b2e124ba4","orgId":2,"name":"Siloam Hospitals Lippo Village","alias":"SHLV","zone":7,"isBpjs":true,"isBridging":true},"collection":[{"id":"39764039-37b9-4176-a025-ef7b2e124ba4","orgId":2,"name":"Siloam Hospitals Lippo Village","alias":"SHLV","zone":7,"isBpjs":true,"isBridging":true}]}`);
    fixture = TestBed.createComponent(WidgetSwabListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    const mockAppointmentList = appointmentResponse;
    updateData(component, mockAppointmentList.data);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Should search by patient name`, fakeAsync(() => {

    const key = 'Cut Aisyah Ilmy';
    const newMock = component.appList.filter((val) => val.contact_name === key);

    inputTextChangeAndEnter(de, '#search-name', key);
    fixture.detectChanges();

    spyOn(component.appointmentService, 'getListAppointmentSwab').and.returnValue(of({
      status: 'OK',
      message: 'success',
      data: newMock
    }));
    updateData(component, newMock);

    fixture.detectChanges();

    expect(de.nativeElement.querySelector('#summary-swab-total').textContent).toContain('1');
    expect(de.nativeElement.querySelector('#summary-swab-done').textContent).toContain('0');
    expect(de.nativeElement.querySelector('#summary-swab-undone').textContent).toContain('1');

    flush();
  }));

  it(`Should search by birth date`, fakeAsync(() => {

    const key = '1997-08-08';
    const newMock = component.appList.filter((val) => val.birth_date === key);

    inputTextChangeAndEnter(de, '#search-birth-date', key);
    fixture.detectChanges();

    spyOn(component.appointmentService, 'getListAppointmentSwab').and.returnValue(of({
      status: 'OK',
      message: 'success',
      data: newMock
    }));
    updateData(component, newMock);

    fixture.detectChanges();

    expect(de.nativeElement.querySelector('#summary-swab-total').textContent).toContain('1');
    expect(de.nativeElement.querySelector('#summary-swab-done').textContent).toContain('0');
    expect(de.nativeElement.querySelector('#summary-swab-undone').textContent).toContain('1');

    flush();
  }));

  it(`Should search by Medical Record Number`, fakeAsync(() => {

    const key = 802569;
    const newMock = component.appList.filter((val) => val.medical_record_number === key);

    inputTextChangeAndEnter(de, '#search-mr', key);
    fixture.detectChanges();

    spyOn(component.appointmentService, 'getListAppointmentSwab').and.returnValue(of({
      status: 'OK',
      message: 'success',
      data: newMock
    }));
    updateData(component, newMock);

    fixture.detectChanges();

    expect(de.nativeElement.querySelector('#summary-swab-total').textContent).toContain('4');
    expect(de.nativeElement.querySelector('#summary-swab-done').textContent).toContain('2');
    expect(de.nativeElement.querySelector('#summary-swab-undone').textContent).toContain('2');

    flush();
  }));

  it(`Should search by Identity Number`, fakeAsync(() => {

    const key = '0987654321234567';
    const newMock = component.appList.filter((val) => val.identity_number === key);

    inputTextChangeAndEnter(de, '#search-identity-number', key);
    fixture.detectChanges();

    spyOn(component.appointmentService, 'getListAppointmentSwab').and.returnValue(of({
      status: 'OK',
      message: 'success',
      data: newMock
    }));
    updateData(component, newMock);

    fixture.detectChanges();

    expect(de.nativeElement.querySelector('#summary-swab-total').textContent).toContain('4');
    expect(de.nativeElement.querySelector('#summary-swab-done').textContent).toContain('2');
    expect(de.nativeElement.querySelector('#summary-swab-undone').textContent).toContain('2');

    flush();
  }));

  it(`Should search by Admission Date`, fakeAsync(() => {

    const key = '2022-03-14';
    const newMock = component.appList.filter((val) => val.admission_date === key);

    inputTextChangeAndEnter(de, '#search-admission-date', key);
    fixture.detectChanges();

    spyOn(component.appointmentService, 'getListAppointmentSwab').and.returnValue(of({
      status: 'OK',
      message: 'success',
      data: newMock
    }));
    updateData(component, newMock);

    fixture.detectChanges();

    expect(de.nativeElement.querySelector('#summary-swab-total').textContent).toContain('3');
    expect(de.nativeElement.querySelector('#summary-swab-done').textContent).toContain('1');
    expect(de.nativeElement.querySelector('#summary-swab-undone').textContent).toContain('2');

    flush();
  }));

  it(`Should search by Checkup Result`, fakeAsync(() => {

    const key = 1;

    selectBoxChange(de, `#search-checkup-result`, key);

    fixture.detectChanges();
    fixture.whenStable().then(() => {

      const newKey = (component.model.checkupResult === 'true');
      const newMock = component.appList.filter((val) => val.checkup_result === newKey);

      spyOn(component.appointmentService, 'getListAppointmentSwab').and.returnValue(of({
        status: 'OK',
        message: 'success',
        data: newMock
      }));
      updateData(component, newMock);

      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#summary-swab-total').textContent).toContain('2');
      expect(de.nativeElement.querySelector('#summary-swab-done').textContent).toContain('2');
      expect(de.nativeElement.querySelector('#summary-swab-undone').textContent).toContain('0');
    });
  }));


  it(`Should Add Swab Result Modal`, fakeAsync(() => {

    let modalAddSwabResult: any;
    let modalConfirmSwabResult: any;

    // Open Modal
    const btn: HTMLButtonElement = de.nativeElement.querySelector('#appointment-list-table tbody tr:nth-child(3) .btn-add-checkup-result');
    btn.click();
    fixture.detectChanges();
    tick();

    modalAddSwabResult = document.body.querySelector('#modal-add-swab-result');
    expect(modalAddSwabResult).toBeTruthy();

    component.checkupResult = true;
    const btnConfirmSwab: any = document.body.querySelector('.btn.fo_btn_green.btn-modal');
    btnConfirmSwab.click();
    fixture.detectChanges();
    tick();

    modalConfirmSwabResult = document.body.querySelector('#modal-confirm-swab-result');
    expect(modalConfirmSwabResult).toBeTruthy();

    // Close Modal
    const btnCloseConfirmSwab: any = document.body.querySelector('#modal-confirm-swab-result .modal-header button.close');
    btnCloseConfirmSwab.click();
    fixture.detectChanges();
    tick();
    modalConfirmSwabResult = document.body.querySelector('#modal-confirm-swab-result');
    expect(modalConfirmSwabResult).toBeFalsy();

    const btnCloseAddSwab: any = document.body.querySelector('#modal-add-swab-result .modal-header button.close');
    btnCloseAddSwab.click();
    fixture.detectChanges();
    tick();
    modalAddSwabResult = document.body.querySelector('#modal-add-swab-result');
    expect(modalAddSwabResult).toBeFalsy();

  }));

  it(`Should Resend Swab Modal`, fakeAsync(() => {

    let modalResendSwabResult: any;

    // Open Modal
    const elementResendSwab = '#appointment-list-table tbody tr:nth-child(2) .btn-resend-checkup-result';
    const btnResendSwab: HTMLButtonElement = de.nativeElement.querySelector(elementResendSwab);
    btnResendSwab.click();
    fixture.detectChanges();
    tick();

    modalResendSwabResult = document.body.querySelector('#modal-resend-swab-result');
    expect(modalResendSwabResult).toBeTruthy();

    // Close Modal
    const btnCloseResendSwab: any = document.body.querySelector('#modal-resend-swab-result .modal-header button.close');
    btnCloseResendSwab.click();
    fixture.detectChanges();
    tick();
    modalResendSwabResult = document.body.querySelector('#modal-resend-swab-result');
    expect(modalResendSwabResult).toBeFalsy();
  }));
});
