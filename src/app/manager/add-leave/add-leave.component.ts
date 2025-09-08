import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../shared-data/leaveapplication.service';
import { CurrentUserService } from '../../shared-data/currentUserService';
import { PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';

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
    private readonly currentUserService: CurrentUserService
  ) {
    const user = this.currentUserService.getCurrentUser();
    this.availableLeave = user?.remainingCredits ?? 0;

    this.leaveForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      totalDays: new FormControl(0, Validators.required),
      remarks: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  ngOnInit() {
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotalDays());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotalDays());

    const user = this.currentUserService.getCurrentUser();
    this.availableLeave = user?.remainingCredits ?? 0;
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

    const diff =
      Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    this.leaveForm.get('totalDays')?.setValue(diff > 0 ? diff : 0);
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
