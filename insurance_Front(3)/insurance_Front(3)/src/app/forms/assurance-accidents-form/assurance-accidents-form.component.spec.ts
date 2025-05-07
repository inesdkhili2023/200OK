import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceAccidentsFormComponent } from './assurance-accidents-form.component';

describe('AssuranceAccidentsFormComponent', () => {
  let component: AssuranceAccidentsFormComponent;
  let fixture: ComponentFixture<AssuranceAccidentsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssuranceAccidentsFormComponent]
    });
    fixture = TestBed.createComponent(AssuranceAccidentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
