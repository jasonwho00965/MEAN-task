import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomepComponent } from './welcomep.component';

describe('WelcomepComponent', () => {
  let component: WelcomepComponent;
  let fixture: ComponentFixture<WelcomepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
