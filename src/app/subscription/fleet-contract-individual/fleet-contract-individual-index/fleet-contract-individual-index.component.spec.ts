import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetContractIndividualIndexComponent } from './fleet-contract-individual-index.component';

describe('FleetContractIndividualIndexComponent', () => {
  let component: FleetContractIndividualIndexComponent;
  let fixture: ComponentFixture<FleetContractIndividualIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetContractIndividualIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetContractIndividualIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
