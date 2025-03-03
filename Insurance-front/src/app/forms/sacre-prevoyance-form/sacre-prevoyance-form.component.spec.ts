import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SacrePrevoyanceFormComponent } from './sacre-prevoyance-form.component';

describe('SacrePrevoyanceFormComponent', () => {
  let component: SacrePrevoyanceFormComponent;
  let fixture: ComponentFixture<SacrePrevoyanceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SacrePrevoyanceFormComponent]
    });
    fixture = TestBed.createComponent(SacrePrevoyanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
