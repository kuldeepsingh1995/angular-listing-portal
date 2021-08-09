import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRealEstateAgentsComponent } from './header-real-estate-agents.component';

describe('HeaderRealEstateAgentsComponent', () => {
  let component: HeaderRealEstateAgentsComponent;
  let fixture: ComponentFixture<HeaderRealEstateAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderRealEstateAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderRealEstateAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
