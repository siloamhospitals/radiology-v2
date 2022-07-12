import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailPatientComponent } from './modal-detail-patient.component';

describe('ModalDetailPatientComponent', () => {
  let component: ModalDetailPatientComponent;
  let fixture: ComponentFixture<ModalDetailPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetailPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
