import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPaymentComponent } from './header-payment.component';

describe('HeaderPaymentComponent', () => {
  let component: HeaderPaymentComponent;
  let fixture: ComponentFixture<HeaderPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
