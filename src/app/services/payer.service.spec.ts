import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PayerService } from './payer.service';

describe('PayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));
  it('should be created', () => {
    const service: PayerService = TestBed.get(PayerService);
    expect(service).toBeTruthy();
  });
});
