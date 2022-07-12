import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailScheduleComponent } from './modal-detail-schedule.component';

describe('ModalDetailScheduleComponent', () => {
  let component: ModalDetailScheduleComponent;
  let fixture: ComponentFixture<ModalDetailScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetailScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
