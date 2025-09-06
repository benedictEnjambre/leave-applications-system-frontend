import { Routes } from '@angular/router';
import { CreateUserComponent } from './hr/create-user/create-user.component';
import {EditUserComponent} from './hr/edit-user/edit-user.component';

import {EmployeeAddLeaveComponent} from './employee/add-leave/add-leave.component';
import {ManagerViewLeaveComponent} from './manager/view-leave/view-leave.component';
import {ManagerAddLeaveComponent} from './manager/add-leave/add-leave.component';
import {EmployeeMyLeaveComponent} from './employee/my-leave/my-leave.component';

import {UserComponent} from './user/user.component';
import {UsersListComponent} from './hr/user-list/user-list.component';
import {AddLeaveComponent} from './manager/add-leave/add-leave.component';


export const routes: Routes = [
  {
    path: 'hr',
    children: [
      {path:'employees',component:UsersListComponent},
      { path: 'create-employee', component: CreateUserComponent  },
      { path: 'employee/:id/edit', component: EditUserComponent }
    ]
  },
  { path: '**', redirectTo: 'hr/employees' },
  {
    path: 'employee',
    children: [
      {path: 'add-leave', component: EmployeeAddLeaveComponent},
      {path: 'my-leave', component: EmployeeMyLeaveComponent}
    ]
  },
  {
    path: 'manager',
    children: [
      {path: 'add-leave', component: ManagerAddLeaveComponent},
      {path: 'view-employee-leave', component: ManagerViewLeaveComponent},
      {path: 'view-leave', component: ManagerViewLeaveComponent}
    ]
  },
  { path: '**', redirectTo: 'hr/employees' },
];
