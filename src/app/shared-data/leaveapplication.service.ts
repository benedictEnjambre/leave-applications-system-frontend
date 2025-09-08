import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LeaveApplicationRequestBody, PaginatedLeaveApplication} from './paginated-leave-application';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private apiUrl = '/api/v1/leave-application';

  constructor(private http: HttpClient) {
  }

  applyLeave(userId: number, request: LeaveApplicationRequestBody): Observable<PaginatedLeaveApplication> {
    return this.http.post<PaginatedLeaveApplication>(`${this.apiUrl}/${userId}`, request);
  }

  fetchMyLeaves(userId: number, page = 1, max = 5): Observable<PaginatedLeaveApplication> {
    return this.http.get<PaginatedLeaveApplication>(`${this.apiUrl}/${userId}/me?page=${page}&max=${max}`);
  }

  fetchTeamLeaves(userId: number, page = 1, max = 5): Observable<PaginatedLeaveApplication> {
    return this.http.get<PaginatedLeaveApplication>(`${this.apiUrl}/${userId}/team?page=${page}&max=${max}`);
  }

  fetchAllLeaves(userId: number, page = 1, max = 5): Observable<PaginatedLeaveApplication> {
    return this.http.get<PaginatedLeaveApplication>(`${this.apiUrl}/${userId}/all?page=${page}&max=${max}`);
  }

  approveLeave(userId: number, leaveId: number) {
    return this.http.patch(`${this.apiUrl}/${userId}/${leaveId}/approve`, {});
  }

  rejectLeave(userId: number, leaveId: number) {
    return this.http.patch(`${this.apiUrl}/${userId}/${leaveId}/reject`, {});
  }

  cancelLeave(userId: number, leaveId: number) {
    return this.http.patch(`${this.apiUrl}/${userId}/${leaveId}/cancel`, {});
  }


}

