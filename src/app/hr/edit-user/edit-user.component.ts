import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../shared-data/users.service';
import { User, UserRequestBody } from '../../shared-data/paginated-users';

interface Manager {
  id: number;
  name: string;
}

interface Role {
  name: string;
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  user: User = {
    id: 0,
    name: '',
    role: '',
    managerId: null,
    managerName: null,
    totalCredits: 25,
    remainingCredits: 25
  };

  isSubmitting = false;
  managers: Manager[] = [];
  roles: Role[] = [
    { name: 'MANAGER' },
    { name: 'HR' },
    { name: 'EMPLOYEE' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadManagers();

    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!userId) {
      this.router.navigateByUrl('/hr/employees');
      return;
    }

    this.usersService.getUserById(userId).subscribe({
      next: (data) => (this.user = data),
      error: () => console.error('Error loading user')
    });
  }

  private loadManagers(): void {
    this.usersService.getAllUsers(1, 50).subscribe({
      next: (data) => {
        this.managers = data.content
          .filter((u) => u.role === 'MANAGER')
          .map((u) => ({ id: u.id, name: u.name }));
      }
    });
  }

  saveUser(): void {
    if (!this.user) return;

    this.isSubmitting = true;

    const payload: UserRequestBody = {
      name: this.user.name,
      role: this.user.role,
      managerId: this.user.managerId || null,
      totalCredits: this.user.totalCredits,
      remainingCredits: this.user.remainingCredits
    };

    this.usersService.updateUser(this.user.id, payload).subscribe({
      next: () => {
        alert('Employee updated successfully!');
        this.router.navigateByUrl('/hr/employees');
      },
      error: (err) => {
        console.error('Error updating employee:', err);
        alert('Error updating employee. Please try again.');
      },
      complete: () => (this.isSubmitting = false)
    });
  }
}
