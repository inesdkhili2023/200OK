import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceVoyageFormComponent } from './assurance-voyage-form.component';

describe('AssuranceVoyageFormComponent', () => {
  let component: AssuranceVoyageFormComponent;
  let fixture: ComponentFixture<AssuranceVoyageFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssuranceVoyageFormComponent]
    });
    fixture = TestBed.createComponent(AssuranceVoyageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
