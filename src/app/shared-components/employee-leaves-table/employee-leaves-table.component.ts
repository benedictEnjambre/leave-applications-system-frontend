import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApplication } from '../../shared-data/paginated-leave-application';

@Component({
  selector: 'app-employee-leaves-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-leaves-table.component.html',
  styleUrl: './employee-leaves-table.component.scss',
})
export class EmployeeLeavesTableComponent {
  @Input() leaves: LeaveApplication[] = [];
  @Input() loading = false;
  @Input() showActions = true;

  @Output() approveLeave = new EventEmitter<number>();
  @Output() rejectLeave = new EventEmitter<number>();
}
