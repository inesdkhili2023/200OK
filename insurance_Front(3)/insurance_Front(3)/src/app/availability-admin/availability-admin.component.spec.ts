import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityAdminComponent } from './availability-admin.component';

describe('AvailabilityAdminComponent', () => {
  let component: AvailabilityAdminComponent;
  let fixture: ComponentFixture<AvailabilityAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailabilityAdminComponent]
    });
    fixture = TestBed.createComponent(AvailabilityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
