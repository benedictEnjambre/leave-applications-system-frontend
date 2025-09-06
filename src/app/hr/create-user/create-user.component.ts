import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../shared-data/users.service';
import { UserRequestBody } from '../../shared-data/paginated-users';

interface Manager {
  id: number;
  name: string;
}

interface Role {
  name: string;
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit {
  user: UserRequestBody = {
    name: '',
    role: '',
    managerId: null,
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

  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.loadManagers();
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
    this.isSubmitting = true;

    const payload: UserRequestBody = {
      ...this.user,
      managerId: this.user.managerId || null
    };

    this.usersService.saveUser(payload).subscribe({
      next: () => {
        alert('Employee added successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding employee:', err);
        alert('Error adding employee. Please try again.');
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false)
    });
  }

  private resetForm(): void {
    this.user = {
      name: '',
      role: '',
      managerId: null,
      totalCredits: 25,
      remainingCredits: 25
    };
  }
}
