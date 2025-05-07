import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferManagementComponent } from './job-offer-management.component';

describe('JobOfferManagementComponent', () => {
  let component: JobOfferManagementComponent;
  let fixture: ComponentFixture<JobOfferManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOfferManagementComponent]
    });
    fixture = TestBed.createComponent(JobOfferManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
