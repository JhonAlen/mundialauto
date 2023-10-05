import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancingManagementDetailComponent } from './financing-management-detail.component';

describe('FinancingManagementDetailComponent', () => {
  let component: FinancingManagementDetailComponent;
  let fixture: ComponentFixture<FinancingManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancingManagementDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancingManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
