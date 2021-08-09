import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateClientComponent } from './real-estate-client.component';

describe('RealEstateClientComponent', () => {
  let component: RealEstateClientComponent;
  let fixture: ComponentFixture<RealEstateClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealEstateClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
