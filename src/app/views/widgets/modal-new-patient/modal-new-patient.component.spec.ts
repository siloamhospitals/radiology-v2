import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewPatientComponent } from './modal-new-patient.component';

describe('ModalNewPatientComponent', () => {
  let component: ModalNewPatientComponent;
  let fixture: ComponentFixture<ModalNewPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
