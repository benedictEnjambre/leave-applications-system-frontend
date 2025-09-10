import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApplication } from '../../shared-data/paginated-leave-application';

@Component({
  selector: 'app-leaves-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaves-table.component.html',
  styleUrls: ['./leaves-table.component.scss']
})
export class LeavesTableComponent {
  @Input() leaves: LeaveApplication[] = [];
  @Input() loading = false;
  @Input() showCancel = false;  // ✅ enable/disable cancel button
  @Output() cancelLeave = new EventEmitter<number>();

  onCancel(id: number) {
    this.cancelLeave.emit(id);
  }
}
