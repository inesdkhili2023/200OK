import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSinistersListComponent } from './admin-sinisters-list.component';

describe('AdminSinistersListComponent', () => {
  let component: AdminSinistersListComponent;
  let fixture: ComponentFixture<AdminSinistersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSinistersListComponent]
    });
    fixture = TestBed.createComponent(AdminSinistersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
