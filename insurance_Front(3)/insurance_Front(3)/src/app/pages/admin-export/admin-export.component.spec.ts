import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExportComponent } from './admin-export.component';

describe('AdminExportComponent', () => {
  let component: AdminExportComponent;
  let fixture: ComponentFixture<AdminExportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminExportComponent]
    });
    fixture = TestBed.createComponent(AdminExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
