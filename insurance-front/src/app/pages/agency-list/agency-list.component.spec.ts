import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyListComponent } from './agency-list.component';

describe('AgencyListComponent', () => {
  let component: AgencyListComponent;
  let fixture: ComponentFixture<AgencyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgencyListComponent]
    });
    fixture = TestBed.createComponent(AgencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
