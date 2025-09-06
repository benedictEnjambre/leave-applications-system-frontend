import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../shared-data/users.service';
import { User } from '../../shared-data/paginated-users';
import {CurrentUserService} from '../../shared-data/currentUserService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  users: User[] = [];
  selectedUser?: User;

  constructor(
    private usersService: UsersService,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this.usersService.getAllUsers(1, 10).subscribe(response => {
      this.users = response.content;
      if (this.users.length > 0) {
        this.selectedUser = this.users[0];
        this.currentUserService.setCurrentUser(this.selectedUser); // update signal
      }
    });
  }

  onUserChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = Number(target.value);
    this.selectedUser = this.users.find(user => user.id === selectedId);
    if (this.selectedUser) {
      console.log('Selected user object:', this.selectedUser);
      this.currentUserService.setCurrentUser(this.selectedUser); // update signal
    }
  }
}
