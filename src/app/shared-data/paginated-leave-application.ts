export interface PaginatedLeaveApplication {
  pageNumber: number;
  totalCount: number;
  content: LeaveApplication[];
}
export interface LeaveApplication {
  employeeName: string;
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  days: number;
  remarks: string;
}

export interface UserRequestBody {
  startDate: string;
  endDate: string;
  remarks: string;
}


