import { async, TestBed } from '@angular/core/testing';
import { TimepickerComponent } from './time-picker.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

describe('PageHomeComponent', () => {
  let component: TimepickerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimepickerComponent ],
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
