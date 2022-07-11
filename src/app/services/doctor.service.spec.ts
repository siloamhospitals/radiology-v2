import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DoctorService } from './doctor.service';

describe('DoctorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: DoctorService = TestBed.get(DoctorService);
    expect(service).toBeTruthy();
  });
});
