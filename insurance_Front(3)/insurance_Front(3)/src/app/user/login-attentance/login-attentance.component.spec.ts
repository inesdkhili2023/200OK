import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAttentanceComponent } from './login-attentance.component';

describe('LoginAttentanceComponent', () => {
  let component: LoginAttentanceComponent;
  let fixture: ComponentFixture<LoginAttentanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginAttentanceComponent]
    });
    fixture = TestBed.createComponent(LoginAttentanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
