import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedLeaveApplication } from './paginated-leave-application';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private apiUrl = '/api/v1/leave-application';

  constructor(private http: HttpClient) {
  }

  fetchMyLeaves(userId: number, page = 1, max = 5): Observable<PaginatedLeaveApplication> {
    return this.http.get<PaginatedLeaveApplication>(`${this.apiUrl}/${userId}/me?page=${page}&max=${max}`);
  }

  fetchTeamLeaves(userId: number, page = 1, max = 5): Observable<PaginatedLeaveApplication> {
    return this.http.get<PaginatedLeaveApplication>(`${this.apiUrl}/${userId}/team?page=${page}&max=${max}`);
  }
}

