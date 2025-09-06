import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedUsers, User, UserRequestBody, UserUpdateRequest } from './paginated-users';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private URL = '/api/v1/user';
  constructor(private readonly http: HttpClient) {}
  getAllUsers(page: number = 1, max: number = 2): Observable<PaginatedUsers> {
    return this.http.get<PaginatedUsers>(`${this.URL}?max=${max}&page=${page}`);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.URL}/${id}`);
  }
  saveUser(userRequestBody: UserRequestBody): Observable<User> {
    return this.http.post<User>(this.URL, userRequestBody);
  }
  updateUser(id: number, updateBody: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.URL}/${id}`, updateBody);
  }
  deleteUser(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }
}
