import {Component, effect, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LeaveService} from '../../shared-data/leaveapplication.service';
import {CurrentUserService} from '../../shared-data/currentUserService';
import {PaginatedLeaveApplication} from '../../shared-data/paginated-leave-application';
import {UsersService} from '../../shared-data/users.service';

@Component({
  selector: 'app-employee-add-leave',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-leave.component.html',
  styleUrl: './add-leave.component.scss'
})
export class EmployeeAddLeaveComponent implements OnInit {

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

    if (startDate > endDate) {
      alert('Start date cannot be after end date.');
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
    const start = this.leaveForm.get('startDate')?.value;
    const end = this.leaveForm.get('endDate')?.value;

    if (!start || !end) return;

    if (new Date(start) > new Date(end)) {
      alert('Start date cannot be after end date.');
      return;
    }

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

            this.availableLeave = Math.max(this.availableLeave - totalDays, 0);

            this.usersService.getUserById(user.id).subscribe(updatedUser => {
              this.currentUserService.setCurrentUser(updatedUser); // update global state
              this.availableLeave = updatedUser.remainingCredits ?? 0;
            });

            // reset form
            this.leaveForm.reset({totalDays: 0});
            this.router.navigate(['employee/add-leave']);
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
