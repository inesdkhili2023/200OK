import { TestBed } from '@angular/core/testing';

import { CapitalisationService } from './capitalisation.service';

describe('CapitalisationService', () => {
  let service: CapitalisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapitalisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
