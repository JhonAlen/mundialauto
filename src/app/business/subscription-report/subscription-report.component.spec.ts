import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionReportComponent } from './subscription-report.component';

describe('SubscriptionReportComponent', () => {
  let component: SubscriptionReportComponent;
  let fixture: ComponentFixture<SubscriptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
