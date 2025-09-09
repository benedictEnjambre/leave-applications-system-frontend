import {Component, effect, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../shared-data/leaveapplication.service';
import { CurrentUserService } from '../../shared-data/currentUserService';
import { PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';
import {UsersService} from '../../shared-data/users.service';

@Component({
  selector: 'app-manager-add-leave',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class ManagerAddLeaveComponent implements OnInit{
  leaveForm: FormGroup;
  isSubmitting = false;
  availableLeave = 0;

  constructor(
    private readonly router: Router,
    private readonly leaveService: LeaveService,
    private readonly currentUserService: CurrentUserService,
    private readonly usersService: UsersService
  ) {
    const user = this.currentUserService.getCurrentUser();
    this.availableLeave = user?.remainingCredits ?? 0;

    this.leaveForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      totalDays: new FormControl(0, Validators.required),
      remarks: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    effect(() => {
      const user = this.currentUserService.getCurrentUser();
      if (user) {
        this.availableLeave = user.remainingCredits;
      }
    });
  }

  ngOnInit() {
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotalDays());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotalDays());
  }

  calculateTotalDays() {
    const start = this.leaveForm.get('startDate')?.value;
    const end = this.leaveForm.get('endDate')?.value;

    if (!start || !end) {
      this.leaveForm.get('totalDays')?.setValue(0);
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < startDate) {
      this.leaveForm.get('totalDays')?.setValue(0);
      return;
    }

    let days = 0;
    let current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }

    this.leaveForm.get('totalDays')?.setValue(days);
  }
  saveLeaveApplication() {
    if (this.leaveForm.valid) {
      const totalDays = this.leaveForm.get('totalDays')?.value;
      if (totalDays > this.availableLeave) {
        alert(`You only have ${this.availableLeave} leave days remaining.`);
        return;
      }

      this.isSubmitting = true;
      const requestBody = this.leaveForm.getRawValue();
      const user = this.currentUserService.getCurrentUser();

      if (user) {
        this.leaveService.applyLeave(user.id, requestBody).subscribe({
          next: (response: PaginatedLeaveApplication) => {
            console.log('Leave request submitted:', response);
            alert('Leave request submitted successfully!');

            // update available leave immediately in UI
            this.availableLeave = Math.max(this.availableLeave - totalDays, 0);

            this.usersService.getUserById(user.id).subscribe(updatedUser => {
              this.currentUserService.setCurrentUser(updatedUser); // update global state
              this.availableLeave = updatedUser.remainingCredits ?? 0;
            });

            // reset form
            this.leaveForm.reset({ totalDays: 0 });
            this.router.navigate(['manager/add-leave']);
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
  }
}
