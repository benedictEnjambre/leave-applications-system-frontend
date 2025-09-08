export interface PaginatedUsers {
  pageNumber: number;
  totalCount: number;
  content: User[];
}
// paginated-users.ts
export interface User {
  id: number;
  name: string;
  role: string;
  managerId: number | null;
  managerName: string | null;
  totalCredits: number;
  remainingCredits: number;
}
export interface UserRequestBody {
  name: string;
  role: string;
  managerId?: number | null;
  totalCredits: number;
  remainingCredits: number;
}
export interface UserUpdateRequest{
  editorId?: number | null; //to be changed to number only
  name: string;
  role: string;
  managerId?: number | null;
  totalCredits: number;
  remainingCredits: number;
}
