export interface PaginatedLeaveApplication {
  pageNumber: number;
  totalCount: number;
  content: LeaveApplication[];
}
export interface LeaveApplication {
  id: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  status: string;
  days: number;
  remarks: string;
}

export interface UserRequestBody {
  startDate: string;
  endDate: string;
  leaveType: string;
  remarks: string;
}


