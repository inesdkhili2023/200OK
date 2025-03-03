import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SacreCapitalisationFormComponent } from './sacre-capitalisation-form.component';

describe('SacreCapitalisationFormComponent', () => {
  let component: SacreCapitalisationFormComponent;
  let fixture: ComponentFixture<SacreCapitalisationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SacreCapitalisationFormComponent]
    });
    fixture = TestBed.createComponent(SacreCapitalisationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
