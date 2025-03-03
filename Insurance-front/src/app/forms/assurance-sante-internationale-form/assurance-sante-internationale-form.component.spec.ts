import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceSanteInternationaleFormComponent } from './assurance-sante-internationale-form.component';

describe('AssuranceSanteInternationaleFormComponent', () => {
  let component: AssuranceSanteInternationaleFormComponent;
  let fixture: ComponentFixture<AssuranceSanteInternationaleFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssuranceSanteInternationaleFormComponent]
    });
    fixture = TestBed.createComponent(AssuranceSanteInternationaleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
