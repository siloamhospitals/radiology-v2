import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListDailyFcfsComponent } from './table-list-daily-fcfs.component';

describe('TableFilterScheduleComponent', () => {
  let component: TableListDailyFcfsComponent;
  let fixture: ComponentFixture<TableListDailyFcfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListDailyFcfsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListDailyFcfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
