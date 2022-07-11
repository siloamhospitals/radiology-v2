import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BpjsService } from './bpjs.service';

describe('BpjsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: BpjsService = TestBed.get(BpjsService);
    expect(service).toBeTruthy();
  });
});
