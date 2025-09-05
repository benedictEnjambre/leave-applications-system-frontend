import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveApplicationService } from '../../shared-data/leave-application-service';
import { LeaveApplication, PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';

@Component({
  selector: 'app-my-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss']
})
export class MyLeaveComponent implements OnChanges {
  @Input() userId!: number;

  leaveApplications: LeaveApplication[] = [];
  totalPages = 0;
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = false;

  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.currentPage = 1; // reset when switching user
      this.loadLeaveApplications();
    }
  }

  loadLeaveApplications(): void {
    this.isLoading = true;

    this.leaveApplicationService.getMyLeaves(this.userId, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: PaginatedLeaveApplication) => {
          this.leaveApplications = response.content;
          this.totalPages = Math.ceil(response.totalCount / this.itemsPerPage);
          this.currentPage = response.pageNumber;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }
}
