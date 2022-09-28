import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRcvComponent } from './plan-rcv.component';

describe('PlanRcvComponent', () => {
  let component: PlanRcvComponent;
  let fixture: ComponentFixture<PlanRcvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanRcvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanRcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
