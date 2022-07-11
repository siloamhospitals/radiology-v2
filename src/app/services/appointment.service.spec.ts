import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppointmentService } from './appointment.service';

describe('AppointmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    expect(service).toBeTruthy();
  });
});
