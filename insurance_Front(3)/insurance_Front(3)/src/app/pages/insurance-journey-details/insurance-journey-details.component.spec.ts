import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceJourneyDetailsComponent } from './insurance-journey-details.component';

describe('InsuranceJourneyDetailsComponent', () => {
  let component: InsuranceJourneyDetailsComponent;
  let fixture: ComponentFixture<InsuranceJourneyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceJourneyDetailsComponent]
    });
    fixture = TestBed.createComponent(InsuranceJourneyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
