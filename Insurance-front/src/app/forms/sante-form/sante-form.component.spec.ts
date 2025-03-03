import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanteFormComponent } from './sante-form.component';

describe('SanteFormComponent', () => {
  let component: SanteFormComponent;
  let fixture: ComponentFixture<SanteFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SanteFormComponent]
    });
    fixture = TestBed.createComponent(SanteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
