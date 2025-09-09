import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LeaveApplication, PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';
import { CurrentUserService } from '../../shared-data/currentUserService';
import {LeaveService} from '../../shared-data/leaveapplication.service';

@Component({
  selector: 'app-my-leave',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss']
})
export class EmployeeMyLeaveComponent implements OnInit {
  leaves: LeaveApplication[] = [];   // ✅ now defined
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  loading = false;

  constructor(
    private currentUserService: CurrentUserService,
    private readonly leaveService: LeaveService
  ) {}

  ngOnInit() {
    const user = this.currentUserService.getCurrentUser();
    if (user) {
      this.loadLeaves(user.id);
    }
  }

  loadLeaves(userId: number) {
    this.loading = true;
    this.leaveService.fetchMyLeaves(userId, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.leaves = response.content;
          this.totalPages = Math.ceil(response.totalCount / this.itemsPerPage);
          this.currentPage = response.pageNumber;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch leaves:', err);
          this.loading = false;
        }
      });
  }

  cancel(leaveId: number) {
    const user = this.currentUserService.getCurrentUser();
    if (!user) return;

    this.leaveService.cancelLeave(user.id, leaveId).subscribe({
      next: () => {
        this.loadLeaves(user.id);
        this.currentUserService.refreshCurrentUser(user.id);
      },
      error: (err: any) => console.error('Failed to cancel leave:', err)
    });
  }
}
