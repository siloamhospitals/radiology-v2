import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HospitalService } from './hospital.service';

describe('HospitalService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: HospitalService = TestBed.get(HospitalService);
    expect(service).toBeTruthy();
  });
});
