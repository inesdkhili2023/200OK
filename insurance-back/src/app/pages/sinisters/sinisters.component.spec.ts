import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistersComponent } from './sinisters.component';

describe('SinistersComponent', () => {
  let component: SinistersComponent;
  let fixture: ComponentFixture<SinistersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinistersComponent]
    });
    fixture = TestBed.createComponent(SinistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
