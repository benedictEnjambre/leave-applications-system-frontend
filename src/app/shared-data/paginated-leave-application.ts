export interface PaginatedLeaveApplication {
  pageNumber: number;
  totalCount: number;
  content: LeaveApplication[];
}
export interface LeaveApplication {
  employeeId: number;
  employeeName: string;
  approverName: string;
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  days: number;
  remarks: string;
  availableCredits: number;
}

export interface LeaveApplicationRequestBody {
  startDate: string;
  endDate: string;
  remarks: string;
}


