import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogingoogleComponent } from './logingoogle.component';

describe('LogingoogleComponent', () => {
  let component: LogingoogleComponent;
  let fixture: ComponentFixture<LogingoogleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogingoogleComponent]
    });
    fixture = TestBed.createComponent(LogingoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
