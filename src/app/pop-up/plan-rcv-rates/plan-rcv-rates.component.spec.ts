import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanRcvRatesComponent } from './plan-rcv-rates.component';

describe('PlanRcvRatesComponent', () => {
  let component: PlanRcvRatesComponent;
  let fixture: ComponentFixture<PlanRcvRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanRcvRatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanRcvRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
