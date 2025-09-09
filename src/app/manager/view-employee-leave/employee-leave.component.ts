import {Component, OnInit} from '@angular/core';
import {LeaveApplication} from '../../shared-data/paginated-leave-application';
import {CurrentUserService} from '../../shared-data/currentUserService';
import {NgForOf, NgIf} from '@angular/common';
import {LeaveService} from '../../shared-data/leaveapplication.service';
import {Router} from '@angular/router';
import {
  EmployeeLeavesTableComponent
} from '../../shared-components/employee-leaves-table/employee-leaves-table.component';
import {PaginationComponent} from '../../shared-components/pagination/pagination.component';

@Component({
  selector: 'view-employee-leave',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    EmployeeLeavesTableComponent,
    PaginationComponent
  ],
  templateUrl: './employee-leave.component.html',
  styleUrl: './employee-leave.component.scss'
})
export class ManagerViewEmployeeLeaveComponent implements OnInit{
  leaves: LeaveApplication[] = [];
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;
  loading = false;

  constructor(
    private currentUserService: CurrentUserService,
    private readonly leaveService: LeaveService,
    private readonly router: Router

) {}

  ngOnInit() {
    const user = this.currentUserService.getCurrentUser();
    if (user) {
      this.loadTeamLeaves(user.id);
    }
  }

  loadTeamLeaves(userId: number) {
    this.loading = true;
    this.leaveService.fetchTeamLeaves(userId, this.currentPage, this.itemsPerPage)
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
      next: () => {
        this.loadTeamLeaves(user.id)
      },
      error: (err: any) => console.error('Failed to approve leave:', err)
    });
  }

  reject(leaveId: number) {
    const user = this.currentUserService.getCurrentUser();
    if (!user) return;

    this.leaveService.rejectLeave(user.id, leaveId).subscribe({
      next: (updatedLeave: LeaveApplication) => {
        this.loadTeamLeaves(user.id);
        this.currentUserService.refreshCurrentUser(updatedLeave.employeeId);
      },
      error: (err: any) => console.error('Failed to reject leave:', err)
    });
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

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    const user = this.currentUserService.getCurrentUser();
    if (!user) return;

    this.currentPage = page;
    this.loadAllLeaves(user.id);
  }
}
