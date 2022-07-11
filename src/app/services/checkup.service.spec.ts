import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CheckupService } from './checkup.service';

describe('CheckupService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: CheckupService = TestBed.get(CheckupService);
    expect(service).toBeTruthy();
  });
});
