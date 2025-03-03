import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackModalComponentComponent } from './pack-modal-component.component';

describe('PackModalComponentComponent', () => {
  let component: PackModalComponentComponent;
  let fixture: ComponentFixture<PackModalComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackModalComponentComponent]
    });
    fixture = TestBed.createComponent(PackModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
