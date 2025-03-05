import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferEditComponent } from './job-offer-edit.component';

describe('JobOfferEditComponent', () => {
  let component: JobOfferEditComponent;
  let fixture: ComponentFixture<JobOfferEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobOfferEditComponent]
    });
    fixture = TestBed.createComponent(JobOfferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
