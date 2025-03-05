import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAppAdminComponent } from './job-app-admin.component';

describe('JobAppAdminComponent', () => {
  let component: JobAppAdminComponent;
  let fixture: ComponentFixture<JobAppAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobAppAdminComponent]
    });
    fixture = TestBed.createComponent(JobAppAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
