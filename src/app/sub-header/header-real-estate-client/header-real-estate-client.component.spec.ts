import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRealEstateClientComponent } from './header-real-estate-client.component';

describe('HeaderRealEstateClientComponent', () => {
  let component: HeaderRealEstateClientComponent;
  let fixture: ComponentFixture<HeaderRealEstateClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderRealEstateClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderRealEstateClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
