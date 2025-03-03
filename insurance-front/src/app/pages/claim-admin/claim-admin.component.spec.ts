import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAdminComponent } from './claim-admin.component';

describe('ClaimAdminComponent', () => {
  let component: ClaimAdminComponent;
  let fixture: ComponentFixture<ClaimAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimAdminComponent]
    });
    fixture = TestBed.createComponent(ClaimAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
