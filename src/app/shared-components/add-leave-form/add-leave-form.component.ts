import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-leave-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-leave-form.component.html',
  styleUrls: ['./add-leave-form.component.scss']
})
export class AddLeaveFormComponent implements OnInit {
  @Input() availableLeave: number = 0;
  @Input() isSubmitting = false;
  @Output() formSubmit = new EventEmitter<any>(); // notify parent when form is valid
  leaveForm!: FormGroup;


  ngOnInit() {
    this.leaveForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      totalDays: new FormControl(0, Validators.required),
      remarks: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

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

  onSubmit() {
    if (!this.leaveForm.valid) return;

    const totalDays = this.leaveForm.get('totalDays')?.value;
    if (totalDays > this.availableLeave) {
      alert(`You only have ${this.availableLeave} leave days remaining.`);
      return;
    }

    this.formSubmit.emit(this.leaveForm.getRawValue());
    this.leaveForm.reset({totalDays: 0});
  }
}
