import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderVerificationComponent } from './header-verification.component';

describe('HeaderVerificationComponent', () => {
  let component: HeaderVerificationComponent;
  let fixture: ComponentFixture<HeaderVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
