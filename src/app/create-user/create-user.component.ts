import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

// Interfaces
interface Manager {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface Employee {
  employeeName: string;
  manager: string;
  totalLeaves: number;
  role: string;
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit{
  employeeForm: FormGroup;
  isSubmitting = false;

  // Sample data - replace with actual data from your service
  managers: Manager[] = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Brown' },
    { id: '4', name: 'Emily Davis' }
  ];

  roles: Role[] = [
    { id: '1', name: 'Software Engineer' },
    { id: '2', name: 'Senior Developer' },
    { id: '3', name: 'Team Lead' },
    { id: '4', name: 'Product Manager' },
    { id: '5', name: 'Designer' },
    { id: '6', name: 'QA Engineer' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    // Load initial data if needed
    this.loadManagers();
    this.loadRoles();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      employeeName: ['', [Validators.required, Validators.minLength(2)]],
      manager: ['', Validators.required],
      totalLeaves: [25, [Validators.required, Validators.min(0), Validators.max(365)]],
      role: ['', Validators.required]
    });
  }

  private loadManagers(): void {
    // Replace with actual service call
    // this.managerService.getManagers().subscribe(managers => {
    //   this.managers = managers;
    // });
  }

  private loadRoles(): void {
    // Replace with actual service call
    // this.roleService.getRoles().subscribe(roles => {
    //   this.roles = roles;
    // });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;

      const employeeData: Employee = this.employeeForm.value;

      // Replace with actual service call
      this.addEmployee(employeeData);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  private addEmployee(employeeData: Employee): void {
    // Simulate API call
    setTimeout(() => {
      console.log('Employee added:', employeeData);

      // Handle success
      this.handleSuccess();
    }, 2000);

    // Replace with actual service call:
    // this.employeeService.addEmployee(employeeData).subscribe({
    //   next: (response) => this.handleSuccess(response),
    //   error: (error) => this.handleError(error),
    //   complete: () => this.isSubmitting = false
    // });
  }

  private handleSuccess(): void {
    this.isSubmitting = false;

    // Reset form
    this.employeeForm.reset();
    this.employeeForm.patchValue({ totalLeaves: 25 });

    // Show success message (you might want to use a toast service)
    alert('Employee added successfully!');

    // Optional: Navigate to employee list or another page
    // this.router.navigate(['/employees']);
  }

  private handleError(error: any): void {
    this.isSubmitting = false;

    // Handle error (you might want to use a toast service)
    console.error('Error adding employee:', error);
    alert('Error adding employee. Please try again.');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for easy access in template
  get employeeName() { return this.employeeForm.get('employeeName'); }
  get manager() { return this.employeeForm.get('manager'); }
  get totalLeaves() { return this.employeeForm.get('totalLeaves'); }
  get role() { return this.employeeForm.get('role'); }
}
