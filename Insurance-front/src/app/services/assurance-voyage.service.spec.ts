import { TestBed } from '@angular/core/testing';

import { AssuranceVoyageService } from './assurance-voyage.service';

describe('AssuranceVoyageService', () => {
  let service: AssuranceVoyageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssuranceVoyageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
