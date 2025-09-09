import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from './paginated-users';
import {UsersService} from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private currentUser: WritableSignal<User | undefined> = signal<User | undefined>(undefined);

  constructor(private usersService: UsersService) {}

  setCurrentUser(user: User) {
    this.currentUser.set(user);
  }

  getCurrentUser(): User | undefined {
    return this.currentUser();
  }

  refreshCurrentUser(userId: number) {
    this.usersService.getUserById(userId).subscribe({
      next: (updatedUser) => this.setCurrentUser(updatedUser),
      error: (err) => console.error('Failed to refresh current user:', err)
    });
  }
  }
