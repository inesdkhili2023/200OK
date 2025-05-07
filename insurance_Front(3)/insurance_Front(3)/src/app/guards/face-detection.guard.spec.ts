import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { faceDetectionGuard } from './face-detection.guard';

describe('faceDetectionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => faceDetectionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
