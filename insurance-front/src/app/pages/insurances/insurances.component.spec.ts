import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancesComponent } from './insurances.component';

describe('InsurancesComponent', () => {
  let component: InsurancesComponent;
  let fixture: ComponentFixture<InsurancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsurancesComponent]
    });
    fixture = TestBed.createComponent(InsurancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
