import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMaintenenceScheduleComponent } from './page-maintenence-schedule.component';

describe('PageMaintenenceScheduleComponent', () => {
  let component: PageMaintenenceScheduleComponent;
  let fixture: ComponentFixture<PageMaintenenceScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageMaintenenceScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMaintenenceScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
