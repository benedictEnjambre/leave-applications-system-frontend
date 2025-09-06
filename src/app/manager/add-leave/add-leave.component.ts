import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LeaveService } from '../../shared-data/leaveapplication.service';
import { CurrentUserService } from '../../shared-data/currentUserService';
import { PaginatedLeaveApplication } from '../../shared-data/paginated-leave-application';

@Component({
  selector: 'app-manager-add-leave',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class ManagerAddLeaveComponent implements OnInit {
  leaveForm: FormGroup;
  isSubmitting = false;
  availableLeave = 0;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private currentUserService: CurrentUserService,
    private router: Router
  ) {
    this.leaveForm = this.createForm();
  }

  ngOnInit(): void {
    const user = this.currentUserService.currentUser();
    if (user) {
      this.availableLeave = user.remainingCredits;
    }

    // Automatically calculate totalDays when startDate or endDate changes
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateTotalDays());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateTotalDays());
  }

  private createForm(): FormGroup {
    return this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalDays: [{ value: 0, disabled: true }, [Validators.required, Validators.min(1)]],
      remarks: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private calculateTotalDays(): void {
    const startValue = this.leaveForm.get('startDate')?.value;
    const endValue = this.leaveForm.get('endDate')?.value;

    if (!startValue || !endValue) {
      this.leaveForm.get('totalDays')?.setValue(0);
      return;
    }

    const start = new Date(startValue);
    const end = new Date(endValue);

    // Normalize to midnight to avoid timezone issues
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    let diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    diff = diff > 0 ? diff : 0;

    this.leaveForm.get('totalDays')?.setValue(diff);
  }

  onSubmit(): void {
    this.calculateTotalDays(); // ensure totalDays is up-to-date

    if (this.leaveForm.valid) {
      const totalDays = this.leaveForm.get('totalDays')?.value;
      if (totalDays > this.availableLeave) {
        alert(`You only have ${this.availableLeave} leave days remaining.`);
        return;
      }

      this.isSubmitting = true;
      const leaveData = this.leaveForm.getRawValue();
      const user = this.currentUserService.currentUser();

      if (user) {
        this.leaveService.applyLeave(user.id, leaveData).subscribe({
          next: (response: PaginatedLeaveApplication) => {
            console.log('Leave request submitted:', response);
            this.isSubmitting = false;
            alert('Leave request submitted successfully!');

            const totalDays = this.leaveForm.get('totalDays')?.value || 0;
            this.availableLeave = Math.max(this.availableLeave - totalDays, 0);

            // Optionally reset the form for new submission
            this.leaveForm.reset({ totalDays: 0 });

            this.router.navigate(['manager/add-leave']);
          },
          error: (err) => {
            console.error('Failed to submit leave request:', err);
            this.isSubmitting = false;
            alert('Failed to submit leave request.');
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.leaveForm.controls).forEach(key => {
      const control = this.leaveForm.get(key);
      control?.markAsTouched();
    });
  }
}
