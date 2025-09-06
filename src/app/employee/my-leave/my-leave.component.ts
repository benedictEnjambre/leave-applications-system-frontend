import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LeaveApplication, PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';
import { CurrentUserService } from '../../shared-data/currentUserService';

@Component({
  selector: 'app-my-leave',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss']
})
export class EmployeeMyLeaveComponent implements OnInit {
  leaves: LeaveApplication[] = [];   // ✅ now defined
  totalCount = 0;
  loading = false;

  constructor(
    private http: HttpClient,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    const user = this.currentUserService.currentUser();
    if (user) {
      this.loadLeaves(user.id);
    }
  }

  loadLeaves(userId: number, page: number = 1, max: number = 5) {
    this.loading = true;
    this.http.get<PaginatedLeaveApplication>(
      `/api/v1/leave-application/${userId}/me?page=${page}&max=${max}`
    ).subscribe({
      next: (response) => {
        this.leaves = response.content;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch leaves:', err);
        this.loading = false;
      }
    });
  }
}
