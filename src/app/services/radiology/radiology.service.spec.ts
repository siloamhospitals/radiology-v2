import { TestBed } from '@angular/core/testing';

import { RadiologyService } from './radiology.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('RadiologyService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: RadiologyService = TestBed.get(RadiologyService);
    expect(service).toBeTruthy();
  });
});
