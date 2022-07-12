import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './date-picker.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

describe('PageHomeComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerComponent ],
      imports: [
        NgxDaterangepickerMd
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
