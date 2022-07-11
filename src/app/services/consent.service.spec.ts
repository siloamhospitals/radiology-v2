import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConsentService } from './consent.service';

describe('ConsentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: ConsentService = TestBed.get(ConsentService);
    expect(service).toBeTruthy();
  });
});
