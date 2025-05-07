import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetraiteFormComponent } from './retraite-form.component';

describe('RetraiteFormComponent', () => {
  let component: RetraiteFormComponent;
  let fixture: ComponentFixture<RetraiteFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetraiteFormComponent]
    });
    fixture = TestBed.createComponent(RetraiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
