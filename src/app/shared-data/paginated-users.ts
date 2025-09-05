export interface PaginatedUsers {
  pageNumber: number;
  totalCount: number;
  content: User[];
}
export interface User {
  id: number;
  name: string;
  role: string;           // maps to backend `Role` enum
  managerName?: string;   // comes from `UserResponse`
  totalCredits?: number;  // nullable in backend
  remainingCredits?: number; // nullable in backend
}
export interface UserRequestBody {
  name: string;
  role: string;
  managerId?: number;       // instead of full User object
  totalCredits?: number;
  remainingCredits?: number;
}
export interface UserUpdateRequest {
  name: string;
  role: string;
  managerId?: number;
  totalCredits?: number;
  remainingCredits?: number;
}
