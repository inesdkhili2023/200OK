import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceDevisComponent } from './assurance-devis.component';

describe('AssuranceDevisComponent', () => {
  let component: AssuranceDevisComponent;
  let fixture: ComponentFixture<AssuranceDevisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssuranceDevisComponent]
    });
    fixture = TestBed.createComponent(AssuranceDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
