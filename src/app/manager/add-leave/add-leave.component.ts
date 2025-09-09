import {Component, effect, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../shared-data/leaveapplication.service';
import { CurrentUserService } from '../../shared-data/currentUserService';
import { PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';
import {UsersService} from '../../shared-data/users.service';
import {AddLeaveFormComponent} from '../../shared-components/add-leave-form/add-leave-form.component';

@Component({
  selector: 'app-manager-add-leave',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AddLeaveFormComponent],
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class ManagerAddLeaveComponent{
  availableLeave = 0;
  isSubmitting = false;

  constructor(
    private readonly router: Router,
    private readonly leaveService: LeaveService,
    private readonly currentUserService: CurrentUserService,
    private readonly usersService: UsersService
  ) {
    effect(() => {
      const user = this.currentUserService.getCurrentUser();
      if (user) {
        this.availableLeave = user.remainingCredits ?? 0;
      }
    });
  }

  saveLeaveApplication(formValue: any) {
    const user = this.currentUserService.getCurrentUser();
    if (!user) return;

    this.isSubmitting = true;
    this.leaveService.applyLeave(user.id, formValue).subscribe({
      next: (response: PaginatedLeaveApplication) => {
        alert('Leave request submitted successfully!');

        this.usersService.getUserById(user.id).subscribe(updatedUser => {
          this.currentUserService.setCurrentUser(updatedUser);
          this.availableLeave = updatedUser.remainingCredits ?? 0;
        });
      },
      error: (err) => {
        console.error('Failed to submit leave request:', err);
        alert('Failed to submit leave request.');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
