import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-manager-add-leave',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-leave.component.html',
  styleUrl: './add-leave.component.scss'
})

export class ManagerAddLeaveComponent implements OnInit{
  protected leaveForm: FormGroup;
  protected isSubmitting: boolean | undefined;
  availableLeave: string | undefined;


  constructor(private fb: FormBuilder) {
    this.leaveForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalDays: [0, [Validators.required, Validators.min(1)]],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  calculateTotalDays(): void {
    const start = new Date(this.leaveForm.get('startDate')?.value);
    const end = new Date(this.leaveForm.get('endDate')?.value);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    const total = diff > 0 ? diff : 0;
    this.leaveForm.get('totalDays')?.setValue(total);
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      this.isSubmitting = true;
      const leaveData = this.leaveForm.getRawValue();

      // Simulate API call
      setTimeout(() => {
        console.log('Leave request submitted:', leaveData);
        this.handleSuccess();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleSuccess(): void {
    this.isSubmitting = false;
    this.leaveForm.reset();
    this.leaveForm.get('totalDays')?.setValue(0);
    alert('Leave request submitted successfully!');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.leaveForm.controls).forEach(key => {
      const control = this.leaveForm.get(key);
      control?.markAsTouched();
    });
  }
}
