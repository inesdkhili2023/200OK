import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatureSComponent } from './candidature-s.component';

describe('CandidatureSComponent', () => {
  let component: CandidatureSComponent;
  let fixture: ComponentFixture<CandidatureSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatureSComponent]
    });
    fixture = TestBed.createComponent(CandidatureSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
