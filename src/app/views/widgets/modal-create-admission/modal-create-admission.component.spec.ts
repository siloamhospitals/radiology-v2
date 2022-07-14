import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateAdmissionComponent } from './modal-create-admission.component';

describe('ModalCreateAdmissionComponent', () => {
  let component: ModalCreateAdmissionComponent;
  let fixture: ComponentFixture<ModalCreateAdmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateAdmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
