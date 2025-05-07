import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferAdminComponent } from './job-offer-admin.component';

describe('JobOfferAdminComponent', () => {
  let component: JobOfferAdminComponent;
  let fixture: ComponentFixture<JobOfferAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOfferAdminComponent]
    });
    fixture = TestBed.createComponent(JobOfferAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
