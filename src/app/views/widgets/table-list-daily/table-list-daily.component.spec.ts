import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListDailyComponent } from './table-list-daily.component';

describe('TableListDailyComponent', () => {
  let component: TableListDailyComponent;
  let fixture: ComponentFixture<TableListDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
