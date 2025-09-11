import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserUpdateRequest } from '../../shared-data/paginated-users';
import { UsersService } from '../../shared-data/users.service';
import { CurrentUserService } from '../../shared-data/currentUserService';
import {SuccessMessageSignalService} from '../../shared-data/success-message-signal.service';

interface Manager {
  id: number;
  name: string;
}

interface Role {
  name: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User | null = null;
  loading = true;
  managers: Manager[] = [];
  roles: Role[] = [
    { name: 'MANAGER' },
    { name: 'HR' },
    { name: 'EMPLOYEE' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usersService: UsersService,
    private readonly currentUserService: CurrentUserService,
    public readonly successMessageSignalService: SuccessMessageSignalService
  ) {}

  ngOnInit(): void {
    this.loadManagers();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigateByUrl('/hr/employees');
      return;
    }

    this.usersService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigateByUrl('/hr/employees');
      }
    });
  }

  private loadManagers(): void {
    this.usersService.getAllUsers(1, 50).subscribe({
      next: (data) => {
        this.managers = data.content
          .filter((u) => u.role === 'MANAGER')
          .map((u) => ({ id: u.id, name: u.name }));
      },
      error: (err) => {
        console.error('Error loading managers:', err);
        this.managers = [];
      }
    });
  }

  saveChanges(): void {
    if (!this.user) return;

    const currentUser = this.currentUserService.getCurrentUser();
    if (!currentUser) {
      alert('No current user set');
      return;
    }

    const updateBody: UserUpdateRequest = {
      editorId: currentUser.id,
      name: this.user.name,
      role: this.user.role,
      managerId: this.user.managerId || null,
      totalCredits: this.user.totalCredits,
      remainingCredits: this.user.remainingCredits
    };

    this.usersService.updateUser(this.user.id, updateBody).subscribe({
      next: () => {
        this.successMessageSignalService.SuccessEventMessage.set('Employee updated successfully!');
        this.router.navigate(['/hr/employees']);
        },
      error: (err) => {
        console.error('Update failed', err);
        alert('Error updating employee. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/hr/employees');
  }
}
