import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeavesTableComponent } from './employee-leaves-table.component';

describe('EmployeeLeavesTableComponent', () => {
  let component: EmployeeLeavesTableComponent;
  let fixture: ComponentFixture<EmployeeLeavesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLeavesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLeavesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
