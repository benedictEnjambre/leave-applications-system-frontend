import {Component, OnInit} from '@angular/core';
import {LeaveApplication} from '../../shared-data/paginated-leave-application';
import {CurrentUserService} from '../../shared-data/currentUserService';
import {LeaveService} from '../../shared-data/leaveapplication.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-hr-view-all-leaves',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './view-all-leaves.component.html',
  styleUrl: './view-all-leaves.component.scss'
})
export class HRViewAllLeavesComponent implements OnInit {
  leaves: LeaveApplication[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  loading = false;

  constructor(
    private currentUserService: CurrentUserService,
    private readonly leaveService: LeaveService
  ) {
  }

  ngOnInit() {
    const user = this.currentUserService.getCurrentUser();
    if (user) {
      this.loadAllLeaves(user.id);
    }
  }

  loadAllLeaves(userId: number) {
    this.loading = true;
    this.leaveService.fetchAllLeaves(userId, this.currentPage, this.itemsPerPage)
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

  approve(leaveId: number) {
    const user = this.currentUserService.getCurrentUser();
    if (!user) return;

    this.leaveService.approveLeave(user.id, leaveId).subscribe({
      next: () => this.loadAllLeaves(user.id),
      error: (err: any) => console.error('Failed to approve leave:', err)
    });
  }

  reject(leaveId: number) {
    const user = this.currentUserService.getCurrentUser();
    if (!user) return;

    this.leaveService.rejectLeave(user.id, leaveId).subscribe({
      next: () => this.loadAllLeaves(user.id),
      error: (err: any) => console.error('Failed to reject leave:', err)
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    const user = this.currentUserService.currentUser();
    if (!user) return;

    this.currentPage = page;
    this.loadAllLeaves(user.id);
  }

}
