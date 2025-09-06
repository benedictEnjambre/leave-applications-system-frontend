import {Component, OnInit} from '@angular/core';
import {LeaveApplication} from '../../shared-data/paginated-leave-application';
import {CurrentUserService} from '../../shared-data/currentUserService';
import {NgForOf, NgIf} from '@angular/common';
import {LeaveService} from '../../shared-data/leaveapplication.service';

@Component({
  selector: 'view-employee-leave',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './employee-leave.component.html',
  styleUrl: './employee-leave.component.scss'
})
export class ManagerViewEmployeeLeaveComponent implements OnInit{
  leaves: LeaveApplication[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  loading = false;

  constructor(
    private currentUserService: CurrentUserService,
    private readonly leaveService: LeaveService
  ) {}

  ngOnInit() {
    const user = this.currentUserService.currentUser();
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
}
