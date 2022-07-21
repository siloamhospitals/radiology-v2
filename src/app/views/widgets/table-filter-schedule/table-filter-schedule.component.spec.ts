import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterScheduleComponent } from './table-filter-schedule.component';

describe('TableFilterScheduleComponent', () => {
  let component: TableFilterScheduleComponent;
  let fixture: ComponentFixture<TableFilterScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFilterScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFilterScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
