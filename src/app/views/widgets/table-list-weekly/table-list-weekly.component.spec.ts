import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListWeeklyComponent } from './table-list-weekly.component';

describe('TableListWeeklyComponent', () => {
  let component: TableListWeeklyComponent;
  let fixture: ComponentFixture<TableListWeeklyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListWeeklyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
