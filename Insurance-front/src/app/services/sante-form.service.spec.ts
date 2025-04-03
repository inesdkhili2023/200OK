import { TestBed } from '@angular/core/testing';

import { SanteFormService } from './sante-form.service';

describe('SanteFormService', () => {
  let service: SanteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanteFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
