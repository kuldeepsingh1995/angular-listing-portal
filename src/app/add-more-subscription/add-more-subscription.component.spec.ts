import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreSubscriptionComponent } from './add-more-subscription.component';

describe('AddMoreSubscriptionComponent', () => {
  let component: AddMoreSubscriptionComponent;
  let fixture: ComponentFixture<AddMoreSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
