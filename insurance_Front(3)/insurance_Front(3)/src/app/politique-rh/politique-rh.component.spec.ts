import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolitiqueRHComponent } from './politique-rh.component';

describe('PolitiqueRHComponent', () => {
  let component: PolitiqueRHComponent;
  let fixture: ComponentFixture<PolitiqueRHComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolitiqueRHComponent]
    });
    fixture = TestBed.createComponent(PolitiqueRHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
