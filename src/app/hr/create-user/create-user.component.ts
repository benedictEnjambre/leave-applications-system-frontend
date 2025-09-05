import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {UsersService} from '../../shared-data/users.service';
import {UserRequestBody} from '../../shared-data/paginated-users';

// Interfaces
interface Manager {
  id: number;
  name: string;
}

interface Role {
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
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit{
  employeeForm: FormGroup;
  isSubmitting = false;

  // Sample data - replace with actual data from your service
  managers: Manager[] = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Brown' },
  ];

  roles: Role[] = [
    { name: 'MANAGER' },
    { name: 'HR' },
    { name: 'EMPLOYEE' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private readonly usersService: UsersService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    // Load initial data if needed
    this.loadManagers();
    this.loadRoles();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', Validators.required],
      managerId: [''],
      totalCredits: [25, [Validators.required, Validators.min(0), Validators.max(365)]],
      remainingCredits: [25, [Validators.required, Validators.min(0), Validators.max(365)]]
    });
  }

  private loadManagers(): void {
    // Replace with actual service call
    // this.managerService.getManagers().subscribe(managers => {
    //   this.managers = managers;
    // });

    this.usersService.getAllUsers(1, 50).subscribe({
      next: (data) => {
        // data.content is the list of all users
        this.managers = data.content
          .filter(user => user.role === 'MANAGER')
          .map(user => ({ id: user.id, name: user.name }));

      }
    });
  }

  private loadRoles(): void {
    // Replace with actual service call
    // this.roleService.getRoles().subscribe(roles => {
    //   this.roles = roles;
    // });
  }
  saveUser(): void {
    console.log(this.employeeForm.getRawValue());

    if (this.employeeForm.valid) {
      this.isSubmitting = true;

      const employeeData: UserRequestBody = {
        ...this.employeeForm.value,
        managerId: this.employeeForm.value.managerId || null
      };

      this.usersService.saveUser(employeeData).subscribe({
        next: (response) => {
          console.log('User saved successfully:', response);
          this.handleSuccess();
        },
        error: (error) => {
          console.error('Error saving user:', error);
          this.handleError(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }


  private addEmployee(employeeData: UserRequestBody): void {
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
