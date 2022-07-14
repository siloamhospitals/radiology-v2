import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownExaminationComponent } from './dropdown-examination.component';

describe('DropdownExaminationComponent', () => {
  let component: DropdownExaminationComponent;
  let fixture: ComponentFixture<DropdownExaminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownExaminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
