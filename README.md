# Leave Management System 

## Overview

This is the frontend application for the Leave Management System
It is built using Angular Standalone Components and includes features for HR, Managers, and Employees

## Key Highlights
- Role-based menus and access (HR, Manager, Employee)
- Reactive forms with validation for leave applications and employee management
- Shared components for reusable tables, forms, and modals.
- Signals (WritableSignal) used for reactive state management between components

## Installation
  ###  Prerequisites
  - Node.js >= 18.x
  - npm >= 9.x
  - Angular CLI >= 16.x
 
  ## Steps

  
```bash
bash

# Clone the repository
git clone <repository-url>

# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Run the development server
ng serve

```
Then open your browser at: http://localhost:4200

## Project Structure
  
```bash
css

src/app/components       → Standalone components (header, sidebar, HR, Manager, Employee views)
src/app/shared-components → Reusable forms, tables, modals, pagination, success messages
src/app/shared-data       → Services, signals, and shared data models

```
## Header & Sidebar
#### HeaderComponent

- Displays a user dropdown
- Fetches all users via UsersService
- Sets the current user using CurrentUserService (WritableSignal)
- SidebarComponent
- Reads current user from CurrentUserService
- Dynamically builds menu items based on user role (HR, Manager, Employee)
- Automatically navigates to the first menu route

#### SidebarComponent

- Reads current user from CurrentUserService
- Dynamically builds menu items based on user role (HR, Manager, Employee)
- Automatically navigates to the first menu route

 ## HR Role
 #### HR Capabilities
- Add new users with:
  - Name
  -  Create Employees and Managers
  - Total leave credits
  - Assigned manager (optional)
- Confirmation modal ensures changes are intentional before submitting

- Edit Users
  - Update user profiles including role, manager assignment, and leave credits
  -Updates refresh the user list automatically

- Assign Employees to Managers
  - During creation or editing, HR can assign employees to managers

- Set Leave Credits
  - Assign total leave days for employees and managers
  - Remaining leave credits are tracked automatically

- View All Leave Applications

  - Paginated table shows leave requests from all employees
  - Approve or reject pending requests.
  - Success messages notify HR of completed actions

## HR Components
```bash CreateUserComponent``` →  Create new employee/manager

```bash  EditUserComponent```  → Edit employee/manager data

```bash UsersListComponent```  → Paginated user list with search and edit option

```bash HRViewAllLeavesComponent```  → Paginated leave table with approve/reject buttons

## Shared components used:
- ```bash EmployeeLeavesTableComponent```  
- ```bash LeavesTableComponent ```  
- ```ConfirmationModalComponent``` 

## Manager Role
#### Manager Capabilities

- Apply for Leave
  - Uses ManagerAddLeaveComponent with AddLeaveFormComponent
  - Validates dates, weekends, and remaining leave balance
  - Shows confirmation modal before submission

- View Own Leave Applications
  - Cancel pending or approved leaves
  - Uses LeavesTableComponent
- View Employee Leave Applications
 - Approve or reject leave requests for employees reporting to the manager
 - Uses EmployeeLeavesTableComponent
 - Updates employee data in CurrentUserService after rejection

## Employee Role
#### Employee Capabilities

- Apply for Leave
  - Uses EmployeeAddLeaveComponent with AddLeaveFormComponent
  - Validates dates, weekends, and remaining leave balance
  - Shows confirmation modal before submission 

- View Own Leave Applications
  - Cancel pending or approved leaves
  - Uses LeavesTableComponent
  - Updates leave balance in CurrentUserService after cancelation

## Shared Components

- ```bash  AddLeaveFormComponent```   → Reusable leave form with validation & confirmation modal

- ```bash  EmployeeLeavesTableComponent ```   → Reusable table for employee leave requests

- ```bash  LeavesTableComponent ```   → Reusable table for own leave requests with cancel option

- ```bash  PaginationComponent ```  →  Paginated table navigation

- ```bash SuccessMessageComponent ```  → Displays success, info, or error messages

- ```bash ConfirmationModalComponent```   → Generic modal for confirming actions

## Signals & Services
#### CurrentUserService
- Stores and tracks the current user across the app
- Exposes WritableSignal for reactive updates

## Methods:

- ```bash setCurrentUser(user: User) ``` 
- ```bash getCurrentUser(): User | undefined``` 
- ```bash refreshCurrentUser(userId: number)``` 

## Other Services

- UsersService – CRUD operations for users.
- LeaveService – CRUD and approval operations for leaves
- SuccessMessageSignalService – Global success message signals

## Notes

- All dates are validated to prevent weekends as start/end dates for leaves
- Confirmation modals are used for adding, editing, and canceling requests
- Reactive forms provide validation and dynamic calculation of leave days

  ##  Repository Links
- **Backend (Spring Boot)**: [leave-applications-system-backend](https://github.com/benedictEnjambre/leave-applications-system-backend)  

