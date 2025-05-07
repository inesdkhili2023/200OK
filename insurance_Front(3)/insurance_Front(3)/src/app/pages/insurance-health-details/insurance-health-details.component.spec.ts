import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHealthDetailsComponent } from './insurance-health-details.component';

describe('InsuranceHealthDetailsComponent', () => {
  let component: InsuranceHealthDetailsComponent;
  let fixture: ComponentFixture<InsuranceHealthDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceHealthDetailsComponent]
    });
    fixture = TestBed.createComponent(InsuranceHealthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
