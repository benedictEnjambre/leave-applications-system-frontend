import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from './paginated-users';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  currentUser: WritableSignal<User | undefined> = signal<User | undefined>(undefined);

  setCurrentUser(user: User) {
    this.currentUser.set(user);
  }

  getCurrentUser(): User | undefined {
    return this.currentUser();
  }
}
