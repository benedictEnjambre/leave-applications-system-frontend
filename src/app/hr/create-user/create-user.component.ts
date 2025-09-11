import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../shared-data/users.service';
import { UserRequestBody } from '../../shared-data/paginated-users';
import {Router} from '@angular/router';

import {ConfirmationModalComponent} from '../../shared-components/confirmation-modal/confirmation-modal.component';

import {SuccessMessageSignalService} from '../../shared-data/success-message-signal.service';


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
  imports: [FormsModule, ConfirmationModalComponent],
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
  showModal = false; // <-- controls confirmation modal
  managers: Manager[] = [];
  roles: Role[] = [
    { name: 'MANAGER' },
    { name: 'HR' },
    { name: 'EMPLOYEE' }
  ];

  constructor(
    private readonly usersService: UsersService,
    private readonly router: Router,
    public readonly successMessageSignalService: SuccessMessageSignalService
  ) {}

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
    this.showModal = false;

    const payload: UserRequestBody = {
      ...this.user,
      managerId: this.user.managerId || null
    };

    this.usersService.saveUser(payload).subscribe({
      next: () => {
        this.successMessageSignalService.SuccessEventMessage.set('Employee added successfully!');
        this.router.navigate(['/hr/employees']);
      },
      error: (err) => {
        console.error('Error adding employee:', err);
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
