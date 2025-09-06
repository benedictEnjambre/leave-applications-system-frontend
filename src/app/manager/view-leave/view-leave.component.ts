import {Component, OnInit} from '@angular/core';
import {LeaveApplication, PaginatedLeaveApplication} from '../../shared-data/paginated-leave-application';
import {CurrentUserService} from '../../shared-data/currentUserService';
import {NgForOf, NgIf} from '@angular/common';
import {LeaveService} from '../../shared-data/leaveapplication.service';

@Component({
  selector: 'app-view-leave',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './view-leave.component.html',
  styleUrl: './view-leave.component.scss'
})
export class ManagerViewLeaveComponent implements OnInit{
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
    const user = this.currentUserService.currentUser();
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
}
