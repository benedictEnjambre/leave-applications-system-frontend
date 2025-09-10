import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserUpdateRequest } from '../../shared-data/paginated-users';
import { UsersService } from '../../shared-data/users.service';
import { CurrentUserService } from '../../shared-data/currentUserService';
import {ConfirmationModalComponent} from '../../shared-components/confirmation-modal/confirmation-modal.component';

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
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
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


  showModal = false; // <-- controls the modal

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usersService: UsersService,
    private readonly currentUserService: CurrentUserService
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

    this.showModal = false; // <-- controls the modal

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
      next: () => this.router.navigate(['/hr/employees'], { state: { edited: true } }),
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
