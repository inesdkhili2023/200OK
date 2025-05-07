import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoliaFormComponent } from './ecolia-form.component';

describe('EcoliaFormComponent', () => {
  let component: EcoliaFormComponent;
  let fixture: ComponentFixture<EcoliaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcoliaFormComponent]
    });
    fixture = TestBed.createComponent(EcoliaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
