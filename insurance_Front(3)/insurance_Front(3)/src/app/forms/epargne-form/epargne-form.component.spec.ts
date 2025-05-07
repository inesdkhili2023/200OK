import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpargneFormComponent } from './epargne-form.component';

describe('EpargneFormComponent', () => {
  let component: EpargneFormComponent;
  let fixture: ComponentFixture<EpargneFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpargneFormComponent]
    });
    fixture = TestBed.createComponent(EpargneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
