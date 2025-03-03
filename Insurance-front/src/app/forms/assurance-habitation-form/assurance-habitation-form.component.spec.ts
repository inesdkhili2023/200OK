import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceHabitationFormComponent } from './assurance-habitation-form.component';
import { PackModalComponentComponent } from '../pack-modal-component/pack-modal-component.component';

describe('AssuranceHabitationFormComponent', () => {
  let component: AssuranceHabitationFormComponent;
  let fixture: ComponentFixture<AssuranceHabitationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssuranceHabitationFormComponent]
    });
    fixture = TestBed.createComponent(AssuranceHabitationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  
});

