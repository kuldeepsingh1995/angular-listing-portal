import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUnsubscribeComponent } from './header-unsubscribe.component';

describe('HeaderUnsubscribeComponent', () => {
  let component: HeaderUnsubscribeComponent;
  let fixture: ComponentFixture<HeaderUnsubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderUnsubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
