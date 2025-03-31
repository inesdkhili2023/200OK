import { TestBed } from '@angular/core/testing';

import { EcoliaService } from './ecolia.service';

describe('EcoliaService', () => {
  let service: EcoliaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcoliaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
