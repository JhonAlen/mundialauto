import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancingManagementIndexComponent } from './financing-management-index.component';

describe('FinancingManagementIndexComponent', () => {
  let component: FinancingManagementIndexComponent;
  let fixture: ComponentFixture<FinancingManagementIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancingManagementIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancingManagementIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
