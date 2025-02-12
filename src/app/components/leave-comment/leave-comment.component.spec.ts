import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCommentComponent } from './leave-comment.component';

describe('LeaveCommentComponent', () => {
  let component: LeaveCommentComponent;
  let fixture: ComponentFixture<LeaveCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveCommentComponent]
    });
    fixture = TestBed.createComponent(LeaveCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
