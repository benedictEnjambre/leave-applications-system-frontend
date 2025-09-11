import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UsersService } from '../../shared-data/users.service';
import { User } from '../../shared-data/paginated-users';
import { CurrentUserService } from '../../shared-data/currentUserService';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  users: User[] = [];
  selectedUser?: User;

  constructor(
    private usersService: UsersService,
    private currentUserService: CurrentUserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();

      this.usersService.onUsersUpdated().subscribe(() => {
        this.loadUsers();
      });
    }
  }

  private loadUsers() {
    this.usersService.getAllUsers(1, 50).subscribe({   // fetch more than 10
      next: (response) => {
        this.users = response.content || [];
        if (this.users.length > 0) {
          this.selectedUser = this.users[0];
          this.currentUserService.setCurrentUser(this.selectedUser);
        }
      },
      error: (error) => {
        console.error('Error loading users for header:', error);
        this.users = [];
      }
    });
  }

  onUserChanged(selectedId: number) {
    if (selectedId) {
      this.usersService.getUserById(selectedId).subscribe({
        next: (freshUser) => {
          this.selectedUser = freshUser;
          this.currentUserService.setCurrentUser(freshUser);
        },
        error: (err) => {
          console.error('Failed to fetch user:', err);
        }
      });
    }
  }
}
