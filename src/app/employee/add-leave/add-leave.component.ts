import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveService } from '../../shared-data/leaveapplication.service';
import { CurrentUserService } from '../../shared-data/currentUserService';
import { UsersService } from '../../shared-data/users.service';
import { PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';
import {AddLeaveFormComponent} from '../../shared-components/add-leave-form/add-leave-form.component';
import {SuccessMessageSignalService} from '../../shared-data/success-message-signal.service';
import {SuccessMessageComponent} from '../../shared-components/success-message/success-message.component';

@Component({
  selector: 'app-employee-add-leave',
  standalone: true,
  imports: [AddLeaveFormComponent, SuccessMessageComponent],
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class EmployeeAddLeaveComponent {
  availableLeave = 0;
  isSubmitting = false;

  constructor(
    private readonly router: Router,
    private readonly leaveService: LeaveService,
    private readonly currentUserService: CurrentUserService,
    private readonly usersService: UsersService,
    public readonly successMessageSignalService: SuccessMessageSignalService
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
        this.successMessageSignalService.SuccessEventMessage.set('Leave Application Successfully Applied');
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
