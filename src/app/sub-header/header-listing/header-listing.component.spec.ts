import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderListingComponent } from './header-listing.component';

describe('HeaderListingComponent', () => {
  let component: HeaderListingComponent;
  let fixture: ComponentFixture<HeaderListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
