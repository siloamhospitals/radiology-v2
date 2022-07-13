import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListMonthlyComponent } from './table-list-monthly.component';

describe('TableListMonthlyComponent', () => {
  let component: TableListMonthlyComponent;
  let fixture: ComponentFixture<TableListMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
