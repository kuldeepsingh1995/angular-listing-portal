import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMorePackagesComponent } from './add-more-packages.component';

describe('AddMorePackagesComponent', () => {
  let component: AddMorePackagesComponent;
  let fixture: ComponentFixture<AddMorePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMorePackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMorePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
