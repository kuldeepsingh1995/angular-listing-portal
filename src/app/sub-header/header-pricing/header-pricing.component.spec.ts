import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPricingComponent } from './header-pricing.component';

describe('HeaderPricingComponent', () => {
  let component: HeaderPricingComponent;
  let fixture: ComponentFixture<HeaderPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
