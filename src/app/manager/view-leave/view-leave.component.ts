import {Component, OnInit} from '@angular/core';
import {LeaveApplication, PaginatedLeaveApplication} from '../../shared-data/paginated-leave-application';
import {CurrentUserService} from '../../shared-data/currentUserService';
import {NgForOf, NgIf} from '@angular/common';
import {LeaveService} from '../../shared-data/leaveapplication.service';
import {Router} from '@angular/router';
import {LeavesTableComponent} from '../../shared-components/leaves-table/leaves-table.component';
import {PaginationComponent} from '../../shared-components/pagination/pagination.component';
import {SuccessMessageSignalService} from '../../shared-data/success-message-signal.service';

@Component({
  selector: 'app-view-leave',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    LeavesTableComponent,
    PaginationComponent
  ],
  templateUrl: './view-leave.component.html',
  styleUrls: ['./view-leave.component.scss']
})
export class ManagerViewLeaveComponent implements OnInit{
  leaves: LeaveApplication[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  loading = false;

  constructor(
    private readonly router: Router,
    private currentUserService: CurrentUserService,
    private readonly leaveService: LeaveService,
    public readonly successMessageSignalService: SuccessMessageSignalService
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
        this.successMessageSignalService.SuccessEventMessage.set('Leave Application Successfully Applied');
        this.loadLeaves(user.id);
        this.currentUserService.refreshCurrentUser(user.id);
      },
      error: (err: any) => console.error('Failed to cancel leave:', err)
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    const user = this.currentUserService.getCurrentUser();
    if (!user) return;

    this.currentPage = page;
    this.loadLeaves(user.id);
  }

}
