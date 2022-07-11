import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GeneralService } from './general.service';

describe('GeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: GeneralService = TestBed.get(GeneralService);
    expect(service).toBeTruthy();
  });
});
