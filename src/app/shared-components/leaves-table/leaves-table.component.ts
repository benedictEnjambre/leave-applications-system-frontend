import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApplication } from '../../shared-data/paginated-leave-application';
import { ConfirmationModalComponent } from '../../shared-components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-leaves-table',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './leaves-table.component.html',
  styleUrls: ['./leaves-table.component.scss']
})
export class LeavesTableComponent {
  @Input() leaves: LeaveApplication[] = [];
  @Input() loading = false;
  @Input() showCancel = false;
  @Output() cancelLeave = new EventEmitter<number>();

  showModal = false;
  pendingId: number | null = null;

  onCancel(id: number) {
    this.pendingId = id;
    this.showModal = true;
  }

  confirmCancel() {
    if (this.pendingId !== null) {
      this.cancelLeave.emit(this.pendingId);
      this.pendingId = null;
    }
    this.showModal = false;
  }

  cancelModal() {
    this.showModal = false;
    this.pendingId = null;
  }
}
